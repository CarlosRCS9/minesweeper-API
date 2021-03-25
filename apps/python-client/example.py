from games import MinesweeperGame

minesweeperGame = MinesweeperGame('carloscastillomvc@gmail.com', 'superpassword2')
sessions = minesweeperGame.listSessions()
print('list of sessions:')
print(sessions)
if (len(sessions) > 0):
    session = sessions[0]
    session = minesweeperGame.readSession(session['id'])
    print('session:')
    print(session)
    createdSession = minesweeperGame.createSession(31, 30, 10)
    print('created session:')
    print(createdSession)
    print('session play:')
    print(createdSession.play('left', 1, 1))
    print('delete session:')
    print(createdSession.delete())
