const TokenKey = 'Authorization'
const UserKey = 'document-user';

export function getToken() {
    var token = localStorage.getItem(TokenKey);
    if (token) return token;
    else return token;
}

export function setToken(token) {
    return localStorage.setItem(TokenKey, token);
}

export function removeToken() {
    return localStorage.removeItem(TokenKey);
}


export function getUser() {
    var user = localStorage.getItem(UserKey);
    if (user) return user;
    else return user;
}

export function setUser(user) {
    return localStorage.setItem(UserKey, JSON.stringify(user));
}

export function removeUser() {
    return localStorage.removeItem(UserKey);
}
