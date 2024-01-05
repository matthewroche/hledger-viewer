const express = require('express');
const path = require('path');
const papa = require('papaparse')
const { exec } = require('child_process');
var Readable = require('stream').Readable

const app = express();
const port = process.env.PORT || 3200;

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
    }
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

app.get('/api/balance-sheet', (req, res) => {

    handleExec('bs', req, res, (data) => {
      data.splice(0,1) //Remove header
      res.json(data);
    })

})

app.get('/api/balance-sheet-equity', (req, res) => {

  handleExec('bse', req, res, (data) => {
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
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});