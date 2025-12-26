
/////////////////DOM SELECTORS/////////////////

const header=document.querySelector('header')

const aboutmeContainer=document.querySelector('#aboutMe')

const projectSection =document.querySelector('#projectSection')
const sidebar1=document.querySelector('#projectList')
const projectSpotlight = document.querySelector('#projectSpotlight');
const arrowNav=document.querySelector('#projectNavArrows')

const form=document.querySelector('#formSection')
const emailArea=document.getElementById('contactEmail')
const messageInput=document.getElementById('contactMessage')
const charactersLeft =document.getElementById('charactersLeft')
const emailError=document.querySelector('#emailError')
const messageError=document.getElementById('messageError')

/////////////////CONSTANTS/////////////////

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const invalidCharRegex = /[^a-zA-Z0-9@._-]/;
const maxChars = 300;

/////////////////HEADERR SECTION/////////////////

header.classList.add('header')

/////////////////ABOUT ME SECTION/////////////////

const fetchAboutMe=async()=>{
    try{
        const response=await fetch('./starter/data/aboutMeData.json')
        const data=await response.json()
        console.log(data)
   
    const para = document.createElement('p');
    para.textContent = data.aboutMe;

    const imgDiv = document.createElement('div');
    imgDiv.classList.add('headshotContainer');

    const img = document.createElement('img');
    img.src = data.headshot;
    img.alt = 'Headshot';

    imgDiv.appendChild(img);
    aboutmeContainer.append(para, imgDiv);
       
    }
    catch(error){
        console.error('Error fetching About Me data:', error)
    }
}

fetchAboutMe()

/////////////////PROJECTS SECTION/////////////////

let data=[]

 const createProjectCard=(project)=>{
        const projectDiv=document.createElement('div')
        projectDiv.classList.add('projectCard')
        projectDiv.id=`${project.project_id}`
        
        projectDiv.style.backgroundImage=`url(${project.card_image})`
        projectDiv.style.backgroundSize = 'cover';
        projectDiv.style.backgroundPosition = 'center';

        const projTitle=document.createElement('h4')
        const projDesc=document.createElement('p')
        projTitle.textContent=project.project_name || 'Untitled Project';
        projDesc.textContent=project.short_description || '';
        projectDiv.append(projTitle,projDesc)

        return projectDiv;
    }

    const updateSpotLight=(project)=>{
    projectSpotlight.style.backgroundImage = `url(${project.spotlight_image || '../starter/images/spotlight_placeholder_bg.webp'})`;
    projectSpotlight.style.backgroundRepeat = "no-repeat";
    
    projectSpotlight.textContent='' 
  
    const projName=document.createElement('h3');
    const projDesc=document.createElement('p');
    const projLink=document.createElement('a');

    projName.textContent=project.project_name || 'Untitled Project';
    projDesc.textContent=project.long_description || 'No description available '
    projLink.href=project.url || '#' ;
    projLink.textContent='View Project'

    projectSpotlight.append(projName,projDesc,projLink) ;
 }

const fetchProjects=async()=>{
    try{
     const response=await fetch('./starter/data/projectsData.json')
      data=await response.json()

       const firstProject = data[0] || {
  project_name: "Untitled Project",
  long_description: "No description available.",
  card_image: "../starter/images/card_placeholder_bg.webp",
  url: "#"
     };

    updateSpotLight(firstProject)
    
    const fragment = document.createDocumentFragment();
     data.forEach(project=>{
         fragment.append(createProjectCard(project));
             }
             
    )
    sidebar1.append(fragment);
    
    }catch(error){
       console.error('Error fetching projects:', error);
    }
}

fetchProjects()

sidebar1.addEventListener('click',(e)=>{
    const card=e.target.closest('.projectCard')
    if(!card) return 
    
     const clickedProject = data.find(p => p.project_id == card.id);
     if (!clickedProject) return;

      updateSpotLight(clickedProject)

})

let currentIndex=0;
let projects=[]

const scrollProjects=(index)=>{
    projects=document.querySelectorAll('.projectCard')
      if(!projects.length) return;
        if(index>=projects.length){
           currentIndex=projects.length - 1;
        }
        else if(index<0){
            currentIndex=0;
        }
        else{
            currentIndex=index
        }

         projects[currentIndex].scrollIntoView({
        inline: "center"  ,
         block:  "nearest" 
    });

}



arrowNav.addEventListener('click',(event)=>{
    
    if(event.target.classList.contains('arrow-right')){
         scrollProjects(currentIndex + 1);
    }
    else if (event.target.classList.contains("arrow-left"))
         scrollProjects(currentIndex - 1);


})

/////////////////CONTACT SECTION/////////////////

    const isValidEmail =(email)=>{
        if (email === "") return "Please enter an email.";
        if (invalidCharRegex.test(email)) return "Email contains invalid characters.";
        if (!emailRegex.test(email)) return "Invalid Email formate. Use something like name@example.com."
        return "";
    }

    const isValidMessage=(message)=>{
        if(message === "") return "Message cannot be empty.";
         if (message.length > maxChars)  return "Message cannot exceed 300 characters."
         return "";
    }

messageInput.addEventListener("input", () => {

     if (messageInput.value.length > maxChars) {
    messageInput.value = messageInput.value.slice(0, maxChars);
  }

    const length = messageInput.value.length;
    charactersLeft.textContent = `Characters: ${length}/${maxChars}`;
    messageError.textContent = isValidMessage(messageInput.value);
});
form.addEventListener('submit',(e)=>{
    e.preventDefault()

    const emailValue = emailArea.value.trim();
    const messageValue = messageInput.value.trim();

   const emailErrorMessage=isValidEmail(emailValue);
   const messageErrorMessage=isValidMessage(messageValue);

   emailError.textContent=emailErrorMessage ;
   messageError.textContent=messageErrorMessage;

    if (emailErrorMessage || messageErrorMessage) {
        return;
    }

    
    emailError.textContent = "";
    messageError.textContent = "";
    form.reset();
    charactersLeft.textContent = "Characters: 0/300";
    alert("Form submitted successfully!");

});










