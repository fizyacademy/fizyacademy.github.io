const head = document.head;

function syncDivHeights() {
    const div1 = document.getElementById('sidebar');
    const div2 = document.getElementById('third-container');

    div1.style.height = 'auto';
    div2.style.height = 'auto';

    const div1Height = div1.offsetHeight;
    const div2Height = div2.offsetHeight;

    if (window.matchMedia('(max-width: 767px)').matches) {
        div1.style.height = '100%';
    } else {
        div1.style.height = div2Height + 'px';
    }
}


// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAulOUDi39BQc6DvYulOKqHymlLHjv8Bmo",
    authDomain: "alostaz222-9a139.firebaseapp.com",
    databaseURL: "https://alostaz222-9a139-default-rtdb.firebaseio.com",
    projectId: "alostaz222-9a139",
    storageBucket: "alostaz222-9a139.appspot.com",
    messagingSenderId: "226577240230",
    appId: "1:226577240230:web:dfd5f82810e32fc36a2467",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

/////////////////////////////////////////////////////

class SpecialLoader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="loadingPage" id="loadingPage">
                <div class="loaderCont">
                    <div class="loader"></div>
                </div>
            </div>
        `;

        const loadingPage = document.getElementById('loadingPage');
        window.addEventListener('load', () => {
            setTimeout(loadingToggle, 1500)

            function loadingToggle () {
                loadingPage.style.display = 'none';
                loadingPage.style.height = '0px'
                const mainContainer = document.querySelectorAll('.main-container');
                mainContainer[0].style.display = 'flex';

                if (window.location.pathname == '/sessions' || window.location.pathname == '/sessions.html') {
                    syncDivHeights();
                };
            }
        });
    }
}


class SpecialHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <header class="header" id="header">
                <nav class='nav'>
                    <ul class="headerShow">
                        <li><i class="material-icons" id='showMenu'>menu</i></li>
                        <li><i class="material-icons" id='hideMenu'>close</i></li>
                    </ul>
                    <ul class="mainHeader" id="mainHeader">
                        <div class="headerShow">
                            <li><i class="material-icons" id='hideMenuInner'>close</i></li>
                        </div>
                        <div class='headcont'>
                            <li class="nav"><a href="./">الصفحة الرئيسية</a></li>
                            <li class="nav"><a href="./sessions">المحاضرات</a></li>
                            <li class="nav">
                                <select id="stage">
                                    <option disabled selected>--اختر الصف الدراسي--</option>
                                    <optgroup label="المرحلة الابتدائية">
                                        <option value="4pm">الصف الرابع الابتدائي</option>
                                        <option value="5pm">الصف الخامس الابتدائي</option>
                                        <option value="6pm">الصف السادس الابتدائي</option>
                                    </optgroup>
                                    <optgroup label="المرحلة الاعدادية">
                                        <option value="1pp">الصف الاول الاعدادي</option>
                                        <option value="2pp">الصف الثاني الاعدادي</option>
                                        <option value="3pp">الصف الثالث الاعدادي</option>
                                    </optgroup>
                                    <optgroup label="المرحلة الثانوية">
                                        <option value="1s">الصف الاول الثانوي</option>
                                        <option value="2s">الصف الثاني الثانوي</option>
                                        <option value="3s">الصف الثالث الثانوي</option>
                                    </optgroup>
                                </select>
                            </li>
                            <li class="nav"><a href="./pricing">الاسعار</a></li>
                            <li class="nav"><a href="./contact">تواصل معنا</a></li>
                        </div>
                        <ul>
                            <!--account-->
                        </ul>
                    </ul>
                </nav>
                <ul class="sec">
                    <li class="showS" id="showS">
                        <i class="material-icons" id="sideShow1">menu_open</i>
                        <i class="material-icons" id="sideShow2">keyboard_tab</i>
                    </li>
                </ul>
            </header>
        `;


        const specialHeader = document.querySelector('special-header');

        if (specialHeader) {
            const listItems = this.querySelectorAll('.nav a');
            listItems.forEach(function (item) {
                if (item.href === window.location.href) {
                    item.parentElement.classList.add('active');
                }
            });
    
            document.addEventListener('DOMContentLoaded', () => {
                let sideShow1 = document.getElementById('sideShow1');
                let sideShow2 = document.getElementById('sideShow2');
                let sidebar = document.getElementById('sidebar');
                let thirdContainer = document.getElementById('third-container');
                let showMenu = document.getElementById('showMenu');
                let hideMenu = document.getElementById('hideMenu');
                let hideMenuInner = document.getElementById('hideMenuInner');
                let menu = document.getElementById('mainHeader');


                if (window.location.pathname == '/sessions' || window.location.pathname == '/sessions.html') {
                    sideShow1.addEventListener('click', () => {
                        sidebar.style.display = 'flex';
                        sideShow1.style.display = 'none';
                        sideShow2.style.display = 'block';
                        syncDivHeights();
                    });
        
                    sideShow2.addEventListener('click', () => {
                        sidebar.style.display = 'none';
                        thirdContainer.style.marginRight = '12px';
                        sideShow2.style.display = 'none';
                        sideShow1.style.display = 'block';
                        syncDivHeights();
                    });
        
                    window.addEventListener('DOMContentLoaded', syncDivHeights);
                    window.addEventListener('resize', syncDivHeights);
                    window.addEventListener('load', syncDivHeights);
                    window.addEventListener('click', syncDivHeights);
        
                    // Check if sidebar is visible initially for smaller screens
                    if (window.matchMedia('(max-width: 767px)').matches) {
                        sidebar.style.display = 'none';
                        sideShow1.style.display = 'block';
                        sideShow2.style.display = 'none';
                        thirdContainer.style.marginRight = '12px';
                    } else {
                        // Default behavior for larger screens
                        sidebar.style.display = 'flex';
                        sideShow1.style.display = 'none';
                        sideShow2.style.display = 'block';
                        thirdContainer.style.marginRight = '0px';
                    }
                }
    
                // Show/hide menu
                hideMenu.style.display = "none";
                hideMenu.style.display = 'none';
    
                showMenu.addEventListener('click', () => {
                    menu.style.display = 'flex';
                    showMenu.style.display = 'none';
                    hideMenu.style.display = 'block';
                    hideMenuInner.style.display = 'block';
                });
    
                hideMenu.addEventListener('click', () => {
                    menu.style.display = 'none';
                    hideMenu.style.display = 'none';
                    hideMenu.style.display = 'none';
                    showMenu.style.display = 'block';
                });
    
                hideMenuInner.addEventListener('click', () => {
                    menu.style.display = 'none';
                    hideMenu.style.display = 'none';
                    hideMenu.style.display = 'none';
                    showMenu.style.display = 'block';
                });
    
                // Check initial state of mainHeader to sync with show/hide menu buttons
                if (menu.style.display === 'none') {
                    showMenu.style.display = 'block';
                    hideMenu.style.display = 'none';
                    hideMenuInner.style.display = 'none';
                } else if (menu.style.display === 'flex') {
                    showMenu.style.display = 'none';
                    hideMenu.style.display = 'block';
                    hideMenuInner.style.display = 'block';
                }
            });
        }
    }
}

class SpecialLogo extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="upperContainer">
                <a id="logoContainer" href="./"> 
                    <span>fizyacademy</span>
                    <img src="logo.png" alt="Logo">
                </a>
            </div>
        `;
    }
}

class SpecialFooter extends HTMLElement {
    connectedCallback() {
        const date = new Date();
        const year = date.getFullYear();
        this.innerHTML = `
            <footer>
                <p>fizyacademy &copy; ${year}. All rights reserved.</p>
            </footer>
        `;
    }
}

class SpecialVideo extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <video id='videoPlayer' controls>
                <source src="">
                Your browser does not support the video tag.
            </video>
        `;
    }
}

customElements.define("special-loader", SpecialLoader);
customElements.define("special-header", SpecialHeader);
customElements.define("special-logo", SpecialLogo);
customElements.define("special-footer", SpecialFooter);
customElements.define("special-video", SpecialVideo);


const specialHeader = document.querySelector('special-header');
if (specialHeader) {
    if (window.location.pathname == '/sessions' || window.location.pathname == '/sessions.html') {
        document.getElementById('stage').style.display = 'block';
        document.getElementById('showS').style.display = 'inline';
    } else {
        document.getElementById('stage').style.display = 'none';
        document.getElementById('showS').style.display = 'none';
    }
}

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // Dispatch an event if you want other parts of your app to know about the change
        window.dispatchEvent(new Event('storage'));
    } else {
        // Remove the user data from localStorage when the user signs out
        localStorage.removeItem('userData');
        window.dispatchEvent(new Event('storage'));
        console.log('No user is signed in.');
    };
});