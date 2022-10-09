let fotoPerfil = document.querySelector('.foto img');
let nomePerfil = document.querySelector('.nomeUsuario h1');
let loginPerfil = document.querySelector('.nomeUsuario span');
let contentRepos = document.querySelector('.wrapperRepos');
let textUser = document.querySelector('.nameUser')
let btnSendUser = document.querySelector('.btnSendUser');
let contentFollowers = document.querySelector('.seguidores');
let contentFollowing = document.querySelector('.seguindo');

btnSendUser.addEventListener('click',()=>{
    getDataGithub(textUser.value)
});

const  getDataGithub = async (user)=>{

    textUser.value = '';

    let username = user;

    try {
        const responseMain = await fetch(`https://api.github.com/users/${username}`);
        const responseFollower = await fetch(`https://api.github.com/users/${username}/followers`);
        const responseFollowing = await fetch(`https://api.github.com/users/${username}/following`);
        const responseRepos =  await fetch(`https://api.github.com/users/${username}/repos`)

        const jsonResponseMain = await responseMain.json();
        const jsonResponseFollower = await responseFollower.json();
        const jsonResponseFollowing = await responseFollowing.json();
        const jsonResponseRepos = await responseRepos.json();

        const data = {
            responseMain:{
                ...jsonResponseMain
            },
            responseFollower:{
                ...jsonResponseFollower
            },
            responseFollowing:{
                ...jsonResponseFollowing
            },
            responseRepos:{
                ...jsonResponseRepos
            }
        }

        fillUser(data);

    } catch (error) {
        alert(error)
    }
    
}

const fillUser = (data)=>{

    const infoMain = data.responseMain;
    const infoFollowers = data.responseFollower;
    const infoFollowing = data.responseFollowing;
    const infoRepos = data.responseRepos;

    //Aqui preenche as informações principais do usuário
    infoMain.avatar_url === null ? fotoPerfil.setAttribute('src',"depositphotos_134255634-stock-illustration-avatar-icon-male-profile-gray.jpg")  : fotoPerfil.setAttribute('src',infoMain.avatar_url) ;
    infoMain.avatar_url === undefined ? fotoPerfil.setAttribute('src',"depositphotos_134255634-stock-illustration-avatar-icon-male-profile-gray.jpg"): '' ;
    infoMain.name === null ? nomePerfil.innerHTML = "Sem nome" : nomePerfil.innerHTML = infoMain.name;
    infoMain.name === undefined ? nomePerfil.innerHTML = "Usuário inválido" : nomePerfil.innerHTML = infoMain.name;
    infoMain.login === null ? loginPerfil.innerHTML = "Sem login" : loginPerfil.innerHTML = infoMain.login;
    infoMain.login === undefined ? loginPerfil.innerHTML = "Login" : loginPerfil.innerHTML = infoMain.login;
    document.querySelector('.bio > span').innerText = (infoMain.bio === null ? 'Sem bio' : infoMain.bio);
    document.querySelector('.bio > span').innerText = (infoMain.bio === undefined ? 'Usuário inválido' : infoMain.bio);
    document.querySelector('.localizacao > span').innerText = (infoMain.location === null ? 'Sem localização' : infoMain.location);
    document.querySelector('.localizacao > span').innerText = (infoMain.location === undefined ? 'Usuário inválido' : infoMain.location);

    // Aqui preenche os seguidores
    contentFollowers.innerHTML = '';
    if(Object.keys(infoFollowers).length > 0){
        Object.keys(infoFollowers).forEach((followers)=>{
            if(infoFollowers[followers].login){
                contentFollowers.innerHTML += `
                    <li class="seguidoresSingle">
                        <a href="${infoFollowers[followers].html_url}" target="_blank">
                            <div class="infoSeguidores">
                                <div class="foto">
                                    <img src="${infoFollowers[followers].avatar_url}">
                                </div>
                                <div class="nome">
                                    <p>${infoFollowers[followers].login}</p>
                                </div>
                            </div>
                        </a>
                    </li>
                `
            }else{
                contentFollowers.innerHTML = '';
            }
        })
    }else{
        contentFollowers.innerHTML = `<p class="nofollow">Nenhum seguidor</p>`
    }

    // Aqui preenche oq está seguindo
    contentFollowing.innerHTML = '';
    if(Object.keys(infoFollowing).length > 0){
        Object.keys(infoFollowing).forEach((following)=>{
            if(infoFollowing[following].login){
                contentFollowing.innerHTML += `
                    <li class="seguidoresSingle">
                        <a href="${infoFollowing[following].html_url}" target="_blank">
                            <div class="infoSeguidores">
                                <div class="foto">
                                    <img src="${infoFollowing[following].avatar_url}">
                                </div>
                                <div class="nome">
                                    <p>${infoFollowing[following].login}</p>
                                </div>
                            </div>
                        </a>
                    </li>
                `
            }else{
                contentFollowing.innerHTML = '';
            }
        })
    }else{
        contentFollowing.innerHTML = `<p class="nofollow">Nenhum seguindo</p>`
    }

    // Aqui preenche os repositórios

    contentRepos.innerHTML = '';
    //verificando se o objeto infoRepos não está vazio
    if(Object.keys(infoRepos).length > 0){
        Object.keys(infoRepos).forEach((repos)=>{
            //verificando se existe o objeto nome, se n existe, n existe repositório válido
            if(infoRepos[repos].name){
                setTimeout(()=>{
                    contentRepos.innerHTML += `
                        <li class="boxSingle">
                            <div class="box">
                                <div class="conteudoBox">
                                    <div class="nomeEvisibilidade">
                                        <div class="nome">
                                            <a href="${infoRepos[repos].html_url}" target="_blank">${infoRepos[repos].name}</a>
                                        </div>
                                        <div class="visibilidade">
                                            <span>${infoRepos[repos].visibility}</span>
                                        </div>
                                    </div>
                                    <div class="descricao">
                                        <p>${infoRepos[repos].description === null ? "Sem descrição" : infoRepos[repos].description}</p>
                                    </div>
                                    <div class="linguagens">
                                        <div class="wrapperL">
                                            <div class="ball"></div>
                                            <div class="name">${infoRepos[repos].language === null ? "Nenhuma linguagem encontrada" : infoRepos[repos].language}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    `
                },200)
            }else{
                contentRepos.innerHTML = `<p class="noRepo">Usuário inválido</p>`
            }
        })
    }else{
        contentRepos.innerHTML = `<p class="noRepo">Sem repositórios</p>`
    }
}
