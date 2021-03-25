import requests

def request(verb, path, data, url = 'https://fvr10a1k21.execute-api.us-east-2.amazonaws.com/develop', token = ''):
    url += path
    if (verb == 'GET'):
        r = requests.get(url = url, headers = {
            'Authorization': 'Bearer ' + token
        }, params = data)
    elif (verb == 'POST'):
        r = requests.post(url = url, headers = {
            'Authorization': 'Bearer ' + token
        }, json = data)
    elif (verb == 'DELETE'):
        r = requests.delete(url = url, headers = {
            'Authorization': 'Bearer ' + token
        }, json = data)
    else:
        raise Exception('unknown http verb')
    if (r.status_code != 200 and r.status_code != 201):
        raise Exception(r.json())
    return r.json()

class MinesweeperGameSession:
    def __init__(self, token, data, url = 'https://fvr10a1k21.execute-api.us-east-2.amazonaws.com/develop'):
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
        self.url = url
    def delete(self):
        return request('DELETE', '/games/minesweeper/sessions/' + self.id, {}, self.url, self.token)
    def play(self, click, column, row):
        if (click != 'left' and click != 'right'):
            raise Exception('click must be left or right')
        if (0 > column or column >= self.columns):
            raise Exception('column must be less than ' + self.column)
        if (0 > row or row >= self.rows):
            raise Exception('row must be less than ' + self.rows)
        response = request('POST', '/games/minesweeper/sessions/' + self.id, {
            'click': click,
            'cell': {
                'column': column,
                'row': row
            }
        }, self.url, self.token)
        self.id = response['data']['game']['id']
        self.creatorId = response['data']['game']['creatorId']
        self.columns = response['data']['game']['columns']
        self.rows = response['data']['game']['rows']
        self.mines = response['data']['game']['mines']
        self.initialized = response['data']['game']['initialized']
        self.ended = response['data']['game']['ended']
        self.viewMatrix = response['data']['game']['viewMatrix']
        self.createdDate = response['data']['game']['createdDate']
        self.initializedDate = response['data']['game']['initializedDate']
        self.endedDate = response['data']['game']['endedDate']
        return {'message': response['message']}
    def __str__(self):
        return '\n'.join([key + ': ' + str(value) for [key, value] in self.__dict__.items() if key != 'token'])

class MinesweeperGame:
    def __init__(self, email, password, url = 'https://fvr10a1k21.execute-api.us-east-2.amazonaws.com/develop'):
        self.email = email
        self.password = password
        self.url = url
        self.token = self.login(self.email, self.password, self.url)
    @staticmethod
    def login(email, password, url = 'https://fvr10a1k21.execute-api.us-east-2.amazonaws.com/develop'):
        return request('POST', '/users/login', {
            'email': email,
            'password': password
        }, url)['data']['token']
    def listSessions(self):
        return request('GET', '/games/minesweeper/sessions', {}, self.url, self.token)['data']['games']
    def readSession(self, sessionId):
        return MinesweeperGameSession(self.token, request('GET', '/games/minesweeper/sessions/' + sessionId, {}, self.url, self.token)['data']['game'], self.url)
    def createSession(self, columns = 10, rows = 10, mines = 10):
        return MinesweeperGameSession(self.token, request('POST', '/games/minesweeper/sessions', {
            'columns': columns,
            'rows': rows,
            'mines': mines
        }, self.url, self.token)['data']['game'], self.url)
