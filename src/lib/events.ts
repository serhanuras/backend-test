import fs from 'fs/promises'
import path from 'path'
import type { BankAccountEvent } from '../types'

/**
 * Load events for the given `accountId`.
 *
 * TODO: Implement this function. This is part of the test.
 *
 * The implementation should return a promise that resolves to an array
 * of objects, sourced from the relevant directory inside of the "events"
 * directory at the root of this project.
 *
 * @see saveEvents
 */
export async function loadEvents(
  accountId: string
): Promise<BankAccountEvent[]> {
  try {
    // read all files in directory
    const files = await fs.readdir(
      path.join(__dirname, '../../events', accountId)
    )

    // initial bankAccount event array.
    const bankAccountEvent = [] as BankAccountEvent[]

    for (let index = 0; index < files.length; index++) {
      const fileName = files[index]

      // read file data.
      const fileData = await fs.readFile(
        path.join(__dirname, '../../events', accountId, fileName),
        'utf8'
      )

      // push data as json format.
      bankAccountEvent.push(JSON.parse(fileData))
    }

    return bankAccountEvent
  } catch (ex) {
    const { message } = ex as { message: string }

    // if exception type no such a file, that means account number is not valid.
    // so throw Account not found error.
    if (message.includes('ENOENT: no such file or directory')) {
      throw new Error('Account not found')
    }
    throw ex
  }
}

/**
 * Saves new events.
 */
export async function saveEvents(events: BankAccountEvent[]) {
  await Promise.all(
    events.map(async (event) => {
      const filepath = path.join(
        __dirname,
        '../../events',
        event.accountId,
        `${event.position}.json`
      )
      console.log('Writing new event to', filepath)
      await fs.writeFile(filepath, JSON.stringify(event, null, 2), {
        // Fail if the file already exists
        flag: 'w',
      })
    })
  )
}
