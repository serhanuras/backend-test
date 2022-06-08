import express from 'express'
import { getAccounts, updateAccount } from './lib/accountsService'
import { expressErrorHandler } from './lib/errorHandling'
import { loadEvents } from './lib/events'
import { IBankAccount } from './types'

export const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.contentType('text/html')
  res.send(`
    <style>
      html { font-family: sans-serif; }
      body { padding: 4rem; line-height: 1.5; }
    </style>

    <h1>Ticknovate test</h1>

    <p>Hello! Add your two routes to this app to complete the test.</p>
    
    <p>The boilerplate of the <a href="/accounts/12060626">first one</a> has been done for you, but you'll
    have to complete the implementation, and add the second route for
    changing an account owner's name. See the README for more information.</p>
    
    <p>Good luck!</p>
  `)
})

// Loading events from load Events function and
// injecting it's data into getAccounts in order to retreive account details.
// Jest tests for loadEvents and getAccounts are written inside 'lib/__tests__ folder
// There is a REST Client test file inside the 'rest-client' folder.
app.get('/accounts/:id', async (req, res, next) => {
  try {
    // This `loadEvents` function currently just returns an empty array.
    // Take a look at the function and complete the implementation.
    const events = await loadEvents(req.params.id)
    const account: IBankAccount = await getAccounts(events)

    res.json(account)
  } catch (err) {
    next(err)
  }
})

// getting accountId and new account name from request body.
// injecting them in to updateAccount function.
// Jest tests for loadEvents and getAccounts are written inside 'lib/__tests__ folder
// There is a REST Client test file inside the 'rest-client' folder.
app.post('/accounts', async (req, res, next) => {
  try {
    const accountId = req.body.id
    const accountName = req.body.accountName
    const account: IBankAccount = await updateAccount(accountId, accountName)

    res.json(account)
  } catch (err) {
    next(err)
  }
})

app.use(expressErrorHandler)
