export class GithubUser {
    static async getData(userLogin) {

        const userData = await fetch(`https://api.github.com/users/${userLogin}`);

        if(userData.status === 200) {
            const { name, login, public_repos, followers } = await userData.json();
            return { name, login, public_repos, followers };
        } else {
            return userData.status
        }
    }
}