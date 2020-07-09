const debounce=(func,delay=1000)=>{
    let timeoutId;
    return (...args)=>{
        if(timeoutId){
            clearTimeout(timeoutId)
        }
        timeoutId=setTimeout(()=>{
            func.apply(null,args)
        },delay);
    };
};
function removeChildNode(trigger,child,parent){
    trigger.addEventListener('click',()=>{
        
        child.style.transition='0.8s';
        child.style.opacity='0';
        setTimeout(()=>{
            parent.removeChild(child); 
        },1000)
                    
    })
}