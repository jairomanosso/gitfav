import * as element from './elements.js'
import { GithubUser } from './GithubUser.js'

//Class to receive and add a user's data to localstorage
class FavoriteUsers{
    constructor (){
        this.loadLocalStorage()
    }

    loadLocalStorage(){
        this.favoriteUsers = JSON.parse(localStorage.getItem('@github-favorite-users:')) || []
    }

    updateLocalStorage(){
        localStorage.setItem('@github-favorite-users:', JSON.stringify(this.favoriteUsers))
    }

    async addUser(userLogin) {
        try{
            const userAlreadyAdded = this.favoriteUsers.find(userAdded => userAdded.login === userLogin)
    
            if(userAlreadyAdded) {
                throw new Error(`${userLogin} já adicionado a lista de favoritos do Github!`)
            }
    
            const userData = await GithubUser.getData(userLogin)
    
            if(typeof userData != 'number') {
                this.favoriteUsers = [userData, ...this.favoriteUsers]
                this.updateLocalStorage()
            } else {
                throw new Error(`${userData} - Usuário não encontrado!`)
            }          
        } catch (error){
            alert(error.message)
        }
    }

    removeUser(user) {
        this.favoriteUsers = this.favoriteUsers.filter( favoriteUser => favoriteUser.login !== user.login)
        this.updateLocalStorage()
    }
}

//Class to add localstorage's users' data to the page table
export class showFavoriteUsers extends FavoriteUsers {
    constructor(){
        super()
        this.checkLocalStorage()
        this.getUsernameInputValue()
    }

    checkLocalStorage() {
        if(this.favoriteUsers.length > 0) {
            element.noFavoritesMessage.classList.add('hidden')
            this.showUsers()
        } else {
            this.removeAllRows()
            element.noFavoritesMessage.classList.remove('hidden')
        }
    }

    getUsernameInputValue() {
        element.userFavoriteButton.onclick = async () => {
            await this.addUser(element.githubUsernameInput.value)
            this.checkLocalStorage()
        }
    }

    removeAllRows() {
        element.table.querySelectorAll('tr').forEach(row => {
            if(!row.classList.contains('no-favorites')){
                row.remove()
            }
        })
    }

    createRow(){
        const rowContent = `
            <td class="profile">
                <img class="profile-img" src="" alt="">
                <a class="profile-data-container" href="" target="_blank">
                    <h3 class="username"></h3>
                    <p class="login"></p>
                </a>
            </td>
            <td class="public-repos"></td>
            <td class="followers"></td>
            <td><button class="remove-user-btn">Remover</button></td>
        `

        const row = document.createElement('tr')
        row.classList.add('favorite-user')
        row.innerHTML = rowContent

        return row
    }

    showUsers() {
        this.removeAllRows()

        this.favoriteUsers.forEach( user => {
            const userRow = this.createRow()

            userRow.querySelector('.profile-img').src = `https://github.com/${user.login}.png`
            userRow.querySelector('.profile-img').alt = `Imagem de perfil do usuário ${user.name}`
            userRow.querySelector('.profile-data-container').href = `https://github.com/${user.login}`
            userRow.querySelector('.username').textContent = user.name
            userRow.querySelector('.login').textContent = `/${user.login}`
            userRow.querySelector('.public-repos').textContent = user.public_repos
            userRow.querySelector('.followers').textContent = user.followers
            userRow.querySelector('.remove-user-btn').onclick = () => {
                const confirmRemoveUser = confirm(`Você deseja remover ${user.name} da lista de favoritos?`)

                if(confirmRemoveUser) {
                    this.removeUser(user)
                    this.checkLocalStorage()
                }
            }

            element.table.append(userRow)
        })
    }

}