import { loadEvents } from '../events'

describe('loadEvents', () => {
  it('should return exception, when account is invalid ', async () => {
    await expect(loadEvents('000011122222')).rejects.toThrow(
      'Account not found'
    )
  })

  it('should return accounts, when correct account is provided ', async () => {
    const result = await loadEvents('09406111')

    expect(result).toStrictEqual([
      expect.objectContaining({
        accountId: '09406111',
        type: 'AccountOpened',
        time: '2020-02-07T04:26:54.393Z',
        position: 0,
      }),
      expect.objectContaining({
        accountId: '09406111',
        type: 'MoneyCredited',
        value: 690,
        time: '2020-02-13T16:50:49.527Z',
        position: 1,
      }),
      expect.objectContaining({
        accountId: '09406111',
        type: 'MoneyDebited',
        value: 150,
        time: '2020-02-18T17:11:11.876Z',
        position: 2,
      }),
    ])
  })
})
