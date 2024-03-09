class DomHelper {

    static clearEventListener(element) {
        const clonedElement = element.cloneNode(true);
        element.replaceWith(clonedElement);
        return clonedElement;
    }

    static moveElement(elementId, newDestinationSelector){
        const element = document.getElementById(elementId);
        const destinationElement = document.querySelector(newDestinationSelector);
        destinationElement.append(element);
        element.scrollIntoView({behavior: 'smooth'});

    }
}

class Component {

    constructor(hostElementId,insertBefore = false){
        if(hostElementId){
            this.hostElement = document.getElementById(hostElementId);
        }
        else{
            this.hostElement = document.body;
        }
        this.insertBefore = insertBefore;
    }

    detach() {
        if(this.element) {
            this.element.remove();
        }
        // this.element.parentElement.removeChild(this.element);
    }
    

    attach() {
        // document.body.append(this.element);
        this.hostElement.insertAdjacentElement(this.insertBefore ? 'afterbegin' : 'beforeend',this.element);
    }

}
 
class Tooltip extends Component {

    constructor(closeNotifierFunction, text, hostElementId) {
        super(hostElementId);
        this.closeNotifier = closeNotifierFunction;
        this.text=text;
        this.create();
    }

    closeTooltip = () => {
        this.detach();
        this.closeNotifier();
    }

    create() {
        const tooltipElement = document.createElement('div');
        tooltipElement.className = 'card';
        const tooltipTemplate = document.getElementById('tooltip');
        const tooltipBody = document.importNode(tooltipTemplate.content, true);
        tooltipBody.querySelector('p').textContent = this.text;
        tooltipElement.append(tooltipBody);

        // console.log(this.hostElement.getBoundingClientRect());
        const hostElementLeft = this.hostElement.offsetLeft;
        const hostElementTop = this.hostElement.offsetTop;
        const hostElementHeight = this.hostElement.clientHeight;  //client height or content height
        const parentElementScrolling = this.hostElement.parentElement.scrollTop;

        const x=  hostElementLeft + 20;
        const y = hostElementTop + hostElementHeight - parentElementScrolling - 10;

        tooltipElement.style.position = 'absolute';
        tooltipElement.style.left = x + 'px'; //500px
        tooltipElement.style.top = y + 'px';

        tooltipElement.addEventListener('click',this.closeTooltip);
        this.element = tooltipElement;
    }

}

class ProjectItem {

    hasActiveTooltip = false;

    constructor(id, updateProjectListsFunction,type) {
        this.id = id;
        this.updateProjectListsHandler = updateProjectListsFunction;
        this.connectMoreInfoButton();
        this.connectSwitchButon(type);
        this.connectDrag();
    }

    showMoreInfoHandler() {
        if(this.hasActiveTooltip){
            return;
        }
        const projectElement = document.getElementById(this.id);
        // console.log(projectElement.dataset);
        // projectElement.dataset.someInfo = 'Test'; //dynamically adding
        const tooltipText = projectElement.dataset.extraInfo;
        const tooltip = new Tooltip(()=>{
            this.hasActiveTooltip= false;
        },tooltipText, this.id);
        tooltip.attach();
        this.hasActiveTooltip=true;
    }

    connectDrag() {
        document.getElementById(this.id).addEventListener('dragstart',event => {
            event.dataTransfer.setData('text/plain',this.id);
            event.dataTransfer.effectAllowed = 'move';
        });
    }

    connectMoreInfoButton() {
        const projectItemElement = document.getElementById(this.id);
        const moreInfobutton = projectItemElement.querySelector('button:first-of-type');
        moreInfobutton.addEventListener('click',this.showMoreInfoHandler.bind(this));
    }

    connectSwitchButon (type) {
       const projectItemElement = document.getElementById(this.id);
       let switchButton  =projectItemElement.querySelector('button:last-of-type');
       switchButton = DomHelper.clearEventListener(switchButton);
       switchButton.textContent = type === 'active' ? 'Finish' : 'Activate';
       switchButton.addEventListener('click', this.updateProjectListsHandler.bind(null, this.id));
    }

    update(updateProjectListFunction,type) {
       this.updateProjectListsHandler = updateProjectListFunction;
       this.connectSwitchButon(type);
    }
}

class ProjectList {
    projects = [];

    constructor(type) {
        this.type = type;
        const prjItems = document.querySelectorAll(`#${type}-projects li`);
        for(const prjItem of prjItems) {
            this.projects.push(new ProjectItem(prjItem.id,this.switchProject.bind(this),this.type));
        }
        console.log(this.projects);
        this.connectDropable();
    }

    connectDropable() {
        const list = document.querySelector(`#${this.type}-projects ul`);

        list.addEventListener('dragenter', event => {
            if(event.dataTransfer.types[0]==='text/plain'){
                event.preventDefault();
            }

            list.parentElement.classList.add('droppable');
        });

        list.addEventListener('dragover', event => {
            if(event.dataTransfer.types[0]==='text/plain'){
                event.preventDefault();
            }
        });

        list.addEventListener('dragleave',event=>{
            if(event.relatedTarget.closest(`#${this.type}-project ul`)!== list)
            list.parentElement.classList.remove('droppable');
        });

        list.addEventListener('drop',event=>{
            const prjId = event.dataTransfer.getData('text/plain');
            if(this.projects.find(p=>p.id === prjId)){
                return;
            }
            document.getElementById(prjId).querySelector('button:last-of-type').click(); 
            list.parentElement.classList.remove('droppable');
            event.preventDefault(); //not required
        });
    }

    setSwitchHandlerFunction(switchHandlerFunction) {
        this.switchHandler = switchHandlerFunction;
    }

    addProject(project) {
        this.projects.push(project);
        DomHelper.moveElement(project.id, `#${this.type}-projects ul`);
        project.update(this.switchProject.bind(this), this.type); 
        
    }

    switchProject(projectId) {

        // const projectIndex = this.projects.findIndex(p => p.id === projectId);
        // this.projects.splice(projectIndex,1); this is an option now! shorter alternative
        this.switchHandler(this.projects.find(p => p.id === projectId));
        this.projects = this.projects.filter(p => p.id !== projectId);
    }
}

class App {
    static init() {
        const activeProjectList =  new ProjectList('active');
        const finishedProjectList =  new ProjectList('finished');
        activeProjectList.setSwitchHandlerFunction(finishedProjectList.addProject.bind(finishedProjectList));
        finishedProjectList.setSwitchHandlerFunction(activeProjectList.addProject.bind(activeProjectList));

        // setTimeout(this.init, 3000);  //set timer
       
        // alternative
        // setInterval() runs on every interval

        // clearTimeout() stop interval
        // const someScript = document.createElement('script');
        // someScript.textContent = 'alert("Hi there");';
        // document.head.append(someScript);
    }
}

App.init();