async  function fetchData(url){
    const response=await fetch(url);   
 
   
    return response.json();
    
}


 let currentUsername=''; 
 let currentPage=1;
 let totalRepos =0;

async function renderProfile(username){
        
    try{
        const apiUrl=`https://api.github.com/users/${username}`;

        currentUsername=username;
        const userData=await fetchData(apiUrl)
          
             document.getElementById('name').innerText=userData.name||username;
             document.getElementById("bios").innerText = userData.bio || "No bio";
             document.getElementById("place").innerText ="Location:- "+userData.location || "Not specified";
            
             const socialLinks = document.getElementById("Social");
             let socialLinkHtml='';
               
             
                    

              if (userData.blog) {
                socialLinkHtml+= `<a href="https://www.${userData.blog}" target="_blank">Portfolio:- ${userData.blog}</a>`;
                
              }


              
              if (userData.twitter_username) {
                socialLinkHtml+= `<a href="https://twitter.com/${userData.twitter_username}" target="_blank">Twitter:- ${userData.twitter_username}</a>`;
                
              } 

              socialLinks.innerHTML=socialLinkHtml;

              let repos_num=document.getElementById('Repo-count');

              if(userData.public_repos){
               
                repos_num.innerHTML=`<p>${userData.public_repos} Repositories</p>`;
                totalRepos=userData.public_repos;
              }
              else{
                
                repos_num.innerHTML=`<p>0 Repositories</p>`
              }

             
                const profilePic=document.getElementById('profile-pic');
                profilePic.src=userData.avatar_url;
                showLoader();


              const repoUrl=`https://api.github.com/users/${username}/repos`;
              const repoResponse= await fetchData(repoUrl);
                renderRepos(repoResponse);
                
        
    }catch(ERROR){
       alert(ERROR,"js error")

    }
    finally{
        setTimeout(() => {
            hideLoader();
          }, 1000);
          
     
    }
}



function getUserData() {
    const usernameInput = document.getElementById("username");
    const username = usernameInput.value.trim();

    if (username) {
        renderProfile(username);
    } else {
        alert("Please enter a GitHub username.");
    }
    
    
}

function search(){
  getUserData();
  incerse_repo(5);
  
}


function initializeLoader() {
    const loader = document.getElementById('Loader');
    loader.style.display = 'none';
  }
  
  initializeLoader();



function showLoader() {
    const loader = document.getElementById('Loader');
    loader.style.display = 'block';
    
  }
  
  function hideLoader() {
    const loader = document.getElementById('Loader');
    loader.style.display = 'none';
  }





  function renderRepos(repoResponse){

    console.log(repoResponse); 

    const repo_container=document.getElementById('repo_cont')
    repo_container.innerHTML='';

    
    let reposArray;

    if (Array.isArray(repoResponse)) {
        reposArray = repoResponse;
    } else if (repoResponse.items && Array.isArray(repoResponse.items)) {
       
        reposArray = repoResponse.items;
    } else {
        console.error('Invalid repository response format');
        return;
    }

    const startIdx=(currentPage -1)*reposPerPage;
    const endIdx=startIdx+reposPerPage;
    const displatRepos=reposArray.slice(startIdx,endIdx);



    displatRepos.forEach(repo => {
     
         const repoElement = document.createElement('div');
         repoElement.classList.add('rep');
         const topics = repo.topics || [];

         repoElement.innerHTML = `
         <h6 class="">${repo.name}</h6>
         <p>${repo.description || 'No description available'}</p>
         <div class="tags">
         ${topics.map(topic => `<div class="tag">${topic}</div>`).join('')}
            
         </div>
         `
         ;
         repo_container.appendChild(repoElement);
    });

  }


 
  let reposPerPage=5;

  function loadPage(direaction){
    const prevBtn=document.getElementById('PREV_btn');
    const nextBtn=document.getElementById('NEXT_btn');
    const totalPages = Math.ceil(totalRepos / reposPerPage);
    if(direaction=="prev" && currentPage>1)
    {
        currentPage--;
    }
    else if(direaction==="next" && currentPage < totalPages){
        currentPage++;

    }


    prevBtn.disabled=currentPage===1;
    nextBtn.disabled=currentPage===totalPages;


    
    document.getElementById('page_all').innerHTML = `<p>Page ${currentPage} of ${Math.ceil(totalRepos / reposPerPage)}</p>`;
    

    renderProfile(currentUsername);
    
  }







  document.getElementById('PREV_btn').addEventListener('click', function (event) {
    event.preventDefault();
    loadPage('prev');
});

document.getElementById('NEXT_btn').addEventListener('click', function (event) {
    event.preventDefault(); 
    loadPage('next');
});



function incerse_repo(num){
    reposPerPage = num;
    currentPage = 1;
    document.getElementById('page_all').innerHTML = `<p>Page ${currentPage} of ${Math.ceil(totalRepos / reposPerPage)}</p>`;
    renderProfile(currentUsername);






}

function filterRepos() {
    const filter = document.getElementById('repoSearch').value.trim().toLowerCase();

    const repo_container = document.getElementById('repo_cont');
    const allRepoElements = repo_container.getElementsByClassName('rep');

    for (const repoElement of allRepoElements) {
        const repoName = repoElement.querySelector('h6').innerText.toLowerCase();
        const repoDescription = repoElement.querySelector('p').innerText.toLowerCase();

        // Check if either the repo name or description contains the filter
        const isVisible = repoName.includes(filter) || repoDescription.includes(filter);

        // Show or hide the repo element based on the visibility status
        repoElement.style.display = isVisible ? 'block' : 'none';
    }
}
