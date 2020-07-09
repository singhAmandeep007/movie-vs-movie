const autoCompleteConfig={
    renderOption:(movie)=>{
        const imgSrc=movie.Poster==='N/A'?'':movie.Poster;
        return `
            <img src="${imgSrc}"/>
            ${movie.Title}(${movie.Year})
        `;
    },
    inputValue:(movie)=>{
        return movie.Title;
    },
    fetchData:async (searchTerm)=>{
        const response=await axios.get('https://www.omdbapi.com/',{
            params:{
                apikey:'41d5b6d5',
                s:searchTerm
            }
            });
            if(response.data.Error){
                return [];
            }
            return response.data.Search;
    }
}
createAutoComplete({
    ...autoCompleteConfig,
    root:document.querySelector('#left-autocomplete'),
    onOptionSelect:(movie)=>{
        if(document.querySelector('.tutorial')){
        document.querySelector('.tutorial').classList.add('is-hidden');
        }
        onMovieSelect(movie,document.querySelector('#left-summary'),'left');
    },
    
})
createAutoComplete({
    ...autoCompleteConfig,
    root:document.querySelector('#right-autocomplete'),
    onOptionSelect:(movie)=>{
        if(document.querySelector('.tutorial')){
            document.querySelector('.tutorial').classList.add('is-hidden');
        }
       
        onMovieSelect(movie,document.querySelector('#right-summary'),'right');
    },
    
})

let leftMovie;
let rightMovie;
const onMovieSelect=async (movie,summaryElement,side)=>{
    //console.log(movie);
    const response=await axios.get('https://omdbapi.com/',{
        params:{
            apikey:'41d5b6d5',
            //through the id we can fetch more info about a particular movie
            i:movie.imdbID
        }
    })
    //console.log(response.data);
    summaryElement.innerHTML=movieTemplate(response.data)
    if(side==='left'){
        leftMovie=response.data;
    }else{
        rightMovie=response.data;
    }
    if(leftMovie && rightMovie){
        runComparison();
        
    }

}

const runComparison=()=>{
    console.log('run comparison now')
    let leftSideStats=[];
    let rightSideStats=[];
     leftSideStats=document.querySelectorAll('#left-summary .notification')
     console.log(leftSideStats)
     rightSideStats=document.querySelectorAll('#right-summary .notification')
    if(leftSideStats.length>0 && rightSideStats.length>0){
    leftSideStats.forEach((leftStat,index)=>{
    
       const rightStat=rightSideStats[index];
       //console.log(leftStat,rightStat)
       if(leftStat && rightStat){
       if(leftStat.classList.contains('is-warning')){
        leftStat.classList.remove('is-warning')
        leftStat.classList.add('is-dark')
        }
        if(rightStat.classList.contains('is-warning')){
        rightStat.classList.remove('is-warning')
        rightStat.classList.add('is-dark')
        }
        }
       const leftSideValue= parseFloat(leftStat.dataset.value);
       const rightSideValue=parseFloat(rightStat.dataset.value);

       if(rightSideValue === leftSideValue){
        return;
    }
        if(leftSideValue && rightSideValue){
            
            if(leftSideValue>rightSideValue){
                leftStat.classList.remove('is-dark');
                leftStat.classList.add('is-warning');
            }else{
                rightStat.classList.remove('is-dark');
                rightStat.classList.add('is-warning');
            }
        }
        
    })
    showClear();
}
}


const movieTemplate=(movieDetail)=>{
   
    const awards = movieDetail.Awards.split(' ').reduce((acc, curr) => {
        curr = parseInt(curr);
        if (!isNaN(curr)) acc+=curr;
        return acc;
      }, 0)
    const dollars=parseInt(movieDetail.BoxOffice.replace(/\D/g, ""));
    const metascore=parseInt(movieDetail.Metascore);
    const imdbRating=parseFloat(movieDetail.imdbRating);
    const imdbVotes=parseInt(movieDetail.imdbVotes.replace(/,/g,''))
    
    const genreArr=movieDetail.Genre.split(' ').map(word=>{
        return `<span class="tag is-dark">${word}</span>`
    })
    //console.log(genreArr)
    //console.log(awards,dollars,metascore,imdbRating,imdbVotes)
    return `
  
    <article class="media is-narrow ">
      <figure class="media-left ">
     
            <p class="image"> <img class="image is-128x128" src="${movieDetail.Poster}"/></p>
           
       
      </figure>
      <div class="media-content ">
        <div class="content">
        <h1>${movieDetail.Title}</h1>
        <h4>${genreArr}</h4>
        <p class="is-hidden-mobile">${movieDetail.Plot}</p>
        </div>
      </div>
    </article>
    
    <hr>
    <div class="container ">
    <article data-value=${awards} class="notification is-dark ">    
         
        <p class="title has-text-primary">Awards</p>
        <p class="subtitle">${movieDetail.Awards}</p>
    </article>
    <article data-value=${dollars} class="notification is-dark">
        <p class="title has-text-primary">Box Office</p>
        <p class="subtitle">${movieDetail.BoxOffice}</p>        
    </article>
    <article data-value=${metascore} class="notification is-dark"> 
        <p class="title has-text-primary">Metascore</p>
        <p class="subtitle">${movieDetail.Metascore}</p>
    </article>
    <article data-value=${imdbRating} class="notification is-dark">
       
        <p class="title has-text-primary">IMDB Rating</p>
        <p class="subtitle">${movieDetail.imdbRating}</p>
    </article>
    <article data-value=${imdbVotes} class="notification is-dark">    
    <p class="title has-text-primary">IMDB Votes</p>
    <p class="subtitle">${movieDetail.imdbVotes}</p>
    </article>
    </div>
   
    `;
}

const deleteIcon = document.querySelector('.notification .delete')
const parentNode=document.querySelector('.container .is-fluid');
const childNode=document.querySelector('.tutorial');
const clear=document.querySelector('.clear')
const allInputs=document.querySelectorAll('.clearInput');



removeChildNode(deleteIcon,childNode,parentNode);


function showClear(){    
    clear.classList.remove('is-hidden');
    clear.addEventListener('click',()=>{
        document.querySelector('#left-summary').innerHTML='';
        document.querySelector('#right-summary').innerHTML='';      
        allInputs.forEach((input)=>{
            input.value=''
        })
        clear.classList.add('is-hidden')
    })   
}

 

