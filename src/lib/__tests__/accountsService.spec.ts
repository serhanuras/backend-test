import { getAccounts, updateAccount } from '../accountsService'

describe('AccountService', () => {
  describe('getAccounts', () => {
    it('should return accounts, when correct account is provided ', async () => {
      const result = await getAccounts([
        {
          accountId: '09406111',
          type: 'AccountOpened',
          ownerName: 'Chester Friesen',
          time: '2020-02-07T04:26:54.393Z',
          position: 0,
        },
        {
          accountId: '09406111',
          type: 'MoneyCredited',
          value: 690,
          time: '2020-02-13T16:50:49.527Z',
          position: 1,
        },
        {
          accountId: '09406111',
          type: 'MoneyDebited',
          value: 150,
          time: '2020-02-18T17:11:11.876Z',
          position: 2,
        },
      ])

      expect(result).toEqual(
        expect.objectContaining({
          accountId: '09406111',
          balance: 540,
          isOverdrawn: false,
          openedAt: 1581049614393,
          status: 'open',
          transactions: [
            { timestamp: 1582045871876, type: 'debit', value: 150 },
            { timestamp: 1581612649527, type: 'credit', value: 690 },
          ],
        })
      )
    })
  })
  describe('updateAccount', () => {
    it('should return updated account owner name', async () => {
      const result = await updateAccount('09406111', 'Serhan Uras')

      expect(result).toEqual({
        accountId: '09406111',
        balance: 540,
        isOverdrawn: false,
        openedAt: 1581049614393,
        ownerName: 'Serhan Uras',
        status: 'open',
        transactions: [
          { timestamp: 1582045871876, type: 'debit', value: 150 },
          { timestamp: 1581612649527, type: 'credit', value: 690 },
        ],
      })
    })
  })
})
