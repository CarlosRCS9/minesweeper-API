import requests

class MinesweeperGameSession:
    def __init__(self, token, data):
        self.token = token
        self.id = data['id']
        self.creatorId = data['creatorId']
        self.columns = data['columns']
        self.rows = data['rows']
        self.mines = data['mines']
        self.initialized = data['initialized']
        self.ended = data['ended']
        self.viewMatrix = data['viewMatrix']
        self.createdDate = data['createdDate']
        self.initializedDate = data['initializedDate']
        self.endedDate = data['endedDate']
    def __str__(self):
        return '\n'.join([key + ': ' + str(value) for [key, value] in self.__dict__.items() if key != 'token'])

class MinesweeperGame:
    def __init__(self, email, password, url = 'https://fvr10a1k21.execute-api.us-east-2.amazonaws.com/develop'):
        self.email = email
        self.password = password
        self.url = url
        self.token = self.login(self.email, self.password, self.url)
    @staticmethod
    def request(verb, path, data, url = 'https://fvr10a1k21.execute-api.us-east-2.amazonaws.com/develop', token = ''):
        url += path
        if (verb == 'GET'):
            r = requests.get(url = url, headers = {
                'Authorization': 'Bearer ' + token
            }, params = data)
        elif (verb == 'POST'):
            r = requests.post(url = url, json = data)
        else:
            raise Exception('unknown http verb')
        if (r.status_code != 200 and r.status_code != 201):
            print(r.text)
            raise Exception('request failed')
        return r.json()
    @staticmethod
    def login(email, password, url = 'https://fvr10a1k21.execute-api.us-east-2.amazonaws.com/develop'):
        return MinesweeperGame.request('POST', '/users/login', {
            'email': email,
            'password': password
        }, url)['data']['token']
    def listSessions(self):
        return MinesweeperGame.request('GET', '/games/minesweeper/sessions', {}, self.url, self.token)['data']['games']
    def readSession(self, sessionId):
        return MinesweeperGameSession(self.token, MinesweeperGame.request('GET', '/games/minesweeper/sessions/' + sessionId, {}, self.url, self.token)['data']['game'])
    def createSession(self, columns = 10, rows = 10, mines = 10):
        return MinesweeperGameSession(self.token, MinesweeperGame.request('POST', '/games/minesweeper/sessions', {
            'columns': columns,
            'rows': rows,
            'mines': mines
        }, self.url, self.token)['data']['game'])
