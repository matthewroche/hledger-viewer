const express = require('express');
const path = require('path');
const papa = require('papaparse')
const { exec } = require('child_process');
var Readable = require('stream').Readable;
const cors = require("cors");

const app = express();
// Set up port from command line
const portIndex = process.argv.indexOf('--port');
let port = 3200
if (portIndex > -1) {
  // Retrieve the value after --custom
  port = process.argv[portIndex + 1];
}
// Set up origin from command line
let origin = [];
const originIndex = process.argv.indexOf('--origin');
if (originIndex > -1) {
  // Retrieve the value after --custom
  origin = [process.argv[originIndex + 1]];
}

const intervalParser = (interval) => {
  if (typeof(interval) != 'string') {
    console.log("Invalid type for interval");
    return false
  }
  if (['year', 'month', 'day', 'none'].indexOf(interval) == -1) {
    console.log("Invalid interval string");
    return false
  }
  switch(interval) {
    case 'year':
      return '-Y'
    case 'month':
      return '-M'
    case 'day':
      return '-D'
    default:
      return ''
  }
}

const dateValidater = (date) => {
  return !isNaN(new Date( date) );
}

const createBashCommandWithPeriodValues = (command, queryValues, res) => {

  if (typeof(command) != 'string') {
    return false
  }

  if (queryValues.interval == undefined || queryValues.startDate == undefined || queryValues.endDate == undefined) {
    res.status(400).send('Incorrect parameters');
    return false
  }

  if (intervalParser(queryValues.interval) === false) {
    res.status(400).send('Invalid Interval');
    return false
  }

  if (!dateValidater(queryValues.startDate)) {
    res.status(400).send('Invalid Start Date');
    return false
  }

  if (!dateValidater(queryValues.endDate)) {
    res.status(400).send('Invalid End Date');
    return false
  }

  return 'hledger ' + 
  command + 
  ' -V -s ' + 
  intervalParser(queryValues.interval) + 
  ' -b ' + queryValues.startDate +
  ' -e ' + queryValues.endDate +
  ' -O csv'

}

const handleExec = (command, req, res, callback) => {

  const bashCommand = createBashCommandWithPeriodValues(command, req.query, res)

  if (bashCommand == false) {
    return
  }

  exec(bashCommand, (err, stdout, stderr) => {

    // Handle errors
    if (err | stderr.length != 0) {
      console.log("Error running hledger");
      console.error(err)
      console.log(`stderr: ${stderr}`);
      res.status(500).send('Internal Server Error');

    } else {

      // Stream data into PapaParser
      var dataStream = new Readable() // Turning string into stream
      dataStream.push(stdout)
      dataStream.push(null)
      const parseStream = papa.parse(papa.NODE_STREAM_INPUT);
      dataStream.pipe(parseStream);

      // Accepet parsed data
      let data = [];
      parseStream.on("data", chunk => {
          data.push(chunk);
      });

      // Handle errors parsing
      parseStream.on("error", () => {
          console.log("Error parsing CSV"),
          res.status(500).send('Internal Server Error');
      })

      // Handle data
      parseStream.on("finish", () => {
        callback(data)
      });
  }})
  
}

// Serve static files from the 'dist' folder
app.use(express.static(path.join(__dirname, 'dist')));

// Avoid CORS issues
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Methods", "GET");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
  })
app.use(cors({ origin: ["http://localhost:5173"].concat(origin) }));

app.get('/api/stats', (req, res) => {

  exec('hledger stats', (err, stdout, stderr) => {

    // Handle errors
    if (err | stderr.length != 0) {
      console.log("Error running hledger");
      console.error(err)
      console.log(`stderr: ${stderr}`);
      res.status(500).send('Internal Server Error');

    } else {

      let data = {}

      let mainFileMatch = stdout.match(/Main file.+/gm) || ['']
      data.mainFile = mainFileMatch[0].substring(mainFileMatch[0].indexOf(':') + 2)

      let transactionsSpanMatch = stdout.match(/Transactions span.+/gm) || ['']
      data.transactionsSpan = transactionsSpanMatch[0].substring(transactionsSpanMatch[0].indexOf(':') + 2)

      let lastTransactionMatch = stdout.match(/Last transaction.+/gm) || ['']
      data.lastTransaction = lastTransactionMatch[0].substring(lastTransactionMatch[0].indexOf(':') + 2)

      let transactionsCountMatch = stdout.match(/^Transactions\s\s.+/gm) || ['']
      data.transactionsCount = transactionsCountMatch[0].substring(transactionsCountMatch[0].indexOf(':') + 2)

      let accountsCountMatch = stdout.match(/^Accounts.+/gm) || ['']
      data.accountsCount = accountsCountMatch[0].substring(accountsCountMatch[0].indexOf(':') + 2)

      let commoditiesCountMatch = stdout.match(/^Commodities.+/gm) || ['']
      data.commoditiesCount = commoditiesCountMatch[0].substring(commoditiesCountMatch[0].indexOf(':') + 2)

      res.json(data)

    }

  })

})

app.get('/api/balance-sheet', (req, res) => {

    handleExec('bs', req, res, (data) => {
      data.splice(0,1) //Remove header
      res.json(data);
    })

})

app.get('/api/balance-sheet-equity', (req, res) => {

  handleExec("bse -R --infer-equity --alias '/^(revenues|income|expenses)\\b/=equity' not:desc:'closing balances'", req, res, (data) => {
    data.splice(0,1) //Remove header
    res.json(data);
  })

})

app.get('/api/cash-flow', (req, res) => {

  handleExec('cf', req, res, (data) => {
    data.splice(0,1) //Remove header
    res.json(data);
  })

})

app.get('/api/income-statement', (req, res) => {

  handleExec('is', req, res, (data) => {
    data.splice(0,1) //Remove header
    res.json(data);
  })

})

app.get('/api/graphs/net-worth', (req, res) => {

  handleExec('bs', req, res, (data) => {
    data.splice(0,1) //Remove header
    const dates = data[0]
    dates.splice(0,1) // Remove first column
    const values = data.slice(-1)[0]
    values.splice(0,1) // Remove first column
    const combinedData = [].concat([dates], [values])
    res.json(combinedData);
  })

})

app.get('/api/graphs/revenue-expenses', (req, res) => {

  handleExec('is', req, res, (data) => {
    data.splice(0,1) //Remove header
    const dates = data[0]
    dates.splice(0,1) // Remove first column
    const expensesIndex = data.findIndex(row => row[0] === 'Expenses');
    const revenues = data.slice(expensesIndex-1)[0]
    revenues.splice(0,1) // Remove first column
    const expenses = data.slice(-2,-1)[0]
    expenses.splice(0,1) // Remove first column
    const combinedData = [].concat([dates], [revenues], [expenses])
    res.json(combinedData);
  })

})

app.get('/api/graphs/expenses-breakdown', (req, res) => {

  handleExec('bal Expenses -S', req, res, (data) => {
    let returnedData = {}
    const dates = data[0]
    dates.splice(0,1)
    returnedData.dates = dates
    data.splice(0,1) //Remove dates
    data.forEach(expense => {
      let expenseName = expense[0]
      expense.splice(0,1)
      returnedData[expenseName] = expense
    });
    res.json(returnedData);
  })

})

app.get('/api/graphs/income-breakdown', (req, res) => {

  handleExec('bal Income -S', req, res, (data) => {
    let returnedData = {}
    const dates = data[0]
    dates.splice(0,1)
    returnedData.dates = dates
    data.splice(0,1) //Remove dates
    data.forEach(income => {
      let incomeName = income[0]
      income.splice(0,1)
      returnedData[incomeName] = income.map((x) => x.replace("-", ""))
    });
    res.json(returnedData);
  })

})

app.get('/api/graphs/income-vs-expenses', (req, res) => {

  handleExec('bal income expenses -1 --invert', req, res, (data) => {
    let returnedData = {}
    const dates = data[0]
    dates.splice(0,1)
    returnedData.dates = dates
    data.splice(0,1) //Remove dates
    data.forEach(row => {
      let rowName = row[0].charAt(0).toUpperCase() + row[0].slice(1)
      row.splice(0,1)
      returnedData[rowName] = row
    });
    res.json(returnedData);
  })

})

app.get('/api/graphs/assets-vs-liabilities', (req, res) => {

  handleExec('bal assets liabilities -1 -H', req, res, (data) => {
    let returnedData = {}
    const dates = data[0]
    dates.splice(0,1)
    returnedData.dates = dates
    data.splice(0,1) //Remove dates
    data.forEach(row => {
      let rowName = row[0].charAt(0).toUpperCase() + row[0].slice(1)
      row.splice(0,1)
      returnedData[rowName] = row
    });
    res.json(returnedData);
  })

})

// Catch-all route to serve 'index.html'
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(port, 'localhost', () => {
  console.log(`Server is running on port ${port}`);
});