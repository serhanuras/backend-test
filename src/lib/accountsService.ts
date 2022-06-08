import { BankAccountEvent, IBankAccount } from '../types'
import { loadEvents, saveEvents } from './events'

/**
 * Updating account name and saving all events.
 */
export async function updateAccount(
  accountId: string,
  newOwnerName: string
): Promise<IBankAccount> {
  //Fetching all events.
  const events: BankAccountEvent[] = await loadEvents(accountId)

  //Find accountOpenedEvent
  const accountOpenedEvent = events.find(
    (event) => event.type == 'AccountOpened'
  )

  if (accountOpenedEvent && accountOpenedEvent.type === 'AccountOpened') {
    // Changing account owner name of the object
    accountOpenedEvent.ownerName = newOwnerName
    // Critical, saveEvents request event array, instead of updating all events
    // it should be performer to update only changing event which is accountOpenedEvent only.
    saveEvents([accountOpenedEvent])
  }

  // return updated account.
  return getAccounts(events)
}
/**
 * Return accounts using events.
 */
export async function getAccounts(
  events: BankAccountEvent[]
): Promise<IBankAccount> {
  // initial bank account data.
  const bankAccount: IBankAccount = {
    accountId: '',
    balance: 0,
    isOverdrawn: false,
    openedAt: 0,
    ownerName: '',
    status: 'open',
    transactions: [],
  }

  //iteration over events.
  for (let index = 0; index < events.length; index++) {
    const bankEvent = events[index]

    switch (bankEvent.type) {
      case 'AccountOpened':
        accountOpened(bankAccount, bankEvent)
        break

      case 'MoneyCredited':
        moneyCredited(bankAccount, bankEvent)
        break

      case 'MoneyDebited':
        moneyDebited(bankAccount, bankEvent)
        break
    }
  }

  return bankAccount
}

// if event accountOpened, set only ownerName, accountId and openedAt
function accountOpened(
  bankAccount: IBankAccount,
  bankEvent: BankAccountEvent & { ownerName: string }
) {
  bankAccount.ownerName = bankEvent.ownerName
  bankAccount.accountId = bankEvent.accountId
  bankAccount.openedAt = new Date(bankEvent.time).getTime()
}

// if event moneyCredit, set only balance, isOverdrawn and transactions
function moneyCredited(
  bankAccount: IBankAccount,
  bankEvent: BankAccountEvent & { value: number }
) {
  bankAccount.balance += bankEvent.value
  bankAccount.isOverdrawn = checkIsOverdrawn(bankAccount)
  bankAccount.transactions.unshift({
    timestamp: new Date(bankEvent.time).getTime(),
    type: 'credit',
    value: bankEvent.value,
  })
}

// if event moneyDebited, set only balance, isOverdrawn and transactions
function moneyDebited(
  bankAccount: IBankAccount,
  bankEvent: BankAccountEvent & { value: number }
) {
  bankAccount.balance -= bankEvent.value
  bankAccount.isOverdrawn = checkIsOverdrawn(bankAccount)
  bankAccount.transactions.unshift({
    timestamp: new Date(bankEvent.time).getTime(),
    type: 'debit',
    value: bankEvent.value,
  })
}

function checkIsOverdrawn(bankAccount: IBankAccount) {
  if (bankAccount.balance < 0) {
    return true
  } else {
    return false
  }
}
