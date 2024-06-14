document.addEventListener("DOMContentLoaded", (event) => {
    moment.locale('es-CL');
    let userList = [];
    let lastUserId = 1;

    const gaussian = (min, max, skew) => {
        var u = 0, v = 0;
        while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
        while(v === 0) v = Math.random();
        let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );

        num = num / 10.0 + 0.5; // Translate to 0 -> 1
        if (num > 1 || num < 0) num = gaussian(min, max, skew); // resample between 0 and 1 if out of range
        num = Math.pow(num, skew); // Skew
        num *= max - min; // Stretch to fill range
        num += min; // offset to min
        return num;
    }

    function leftGaussian(){
        const min = 0;
        const max = window.innerWidth;
        const skew = 2;
        return gaussian(min, max, skew);
    }

    function rightGaussian(){
        const min = 0;
        const max = window.innerWidth;
        const skew = 0.25;
        return gaussian(min, max, skew);
    }

    function topGaussian(){
        const min = 0;
        const max = window.innerHeight;
        const skew = 0.25
        return gaussian(min, max, skew)
    }

    function genSpark(options){
        const top = options['top'];
        const left = options['left'];
        const translateX = options['translateX'];
        const translateY = options['translateY'];
        const timeout = options['timeout'];
        const scale = options['scale'];
        const diameter = options['diameter'];

        //Crea el elemento
        let spark = document.createElement("i");

        //Configura css
        spark.classList.add('spark')
        spark.style.top = top;
        spark.style.left = left;
        spark.style.height = diameter;
        spark.style.width = diameter;
        /*console.log(window.innerWidth)
        console.log(`${Math.floor((Math.random() - 0.5) * window.innerWidth)} px`)
        console.log(`${spark.style.top}, ${spark.style.left}`)*/
        // spark.style.setProperty('--offsetX', `${translateX}`);
        // spark.style.setProperty('--offsetY', `${translateY}`);
        // spark.style.setProperty('--scaleSpark', `${scale}`);

        //Añade el spark
        const wrapper = document.getElementsByClassName('cover-container')[0];
        wrapper.appendChild(spark);

        let lightDiameter = Math.floor(diameter.replace(/(^\d+)(.+$)/i,'$1')/3);
        if(lightDiameter<3) lightDiameter = 3;

        //anima
        spark.animate(
            [
                {
                    opacity: 1,
                    easing: "ease-out",
                    boxShadow: `0px 0px ${lightDiameter}px ${lightDiameter}px rgba(243, 14, 23, 0.8)`,
                },
                {
                    transform: `translateX(${translateX}) translateY(${translateY}) scale(${scale})`,
                    easing: "ease-out",
                    opacity: 0,
                    boxShadow: '0px 0px 0px 0px rgba(243, 178, 24, 0.36)',
                },
            ], {
                // opciones de sincronización
                duration: timeout,
                fill: "forwards"
                //iterations: Infinity,
            }
        )

        //Elimina el elemento luego
        setTimeout(()=>spark.remove(), timeout);
        return spark;
    }

    function genSparkPool(){
        for(let i of Array(3)){

            setTimeout(()=>{
                genSpark({
                    top: `${Math.floor(topGaussian())}px`,
                    left: `${Math.floor(leftGaussian())}px`,
                    translateX: `${(Math.random() - 0.5) * window.innerWidth/8}px`,
                    translateY: `${(Math.random() - 1) * window.innerHeight}px`,
                    timeout: 2000,
                    scale: `${gaussian(0, 1, 1)}`,
                    diameter: `${gaussian(0,70,2)}px`
                })

                genSpark({
                    top: `${Math.floor(topGaussian())}px`,
                    left: `${Math.floor(rightGaussian())}px`,
                    translateX: `${(Math.random() - 0.5) * window.innerWidth/8}px`,
                    translateY: `${(Math.random() - 1) * window.innerHeight}px`,
                    timeout: 2000,
                    scale: `${gaussian(0, 1, 1)}`,
                    diameter: `${gaussian(0,70,2)}px`
                })
            }, Math.floor(Math.random()*2000))
        }
    }

    /*genSparkPool();
    setInterval(()=>{
        genSparkPool();
    }, 2000)*/

    setTimeout(()=>{
        const registerBtn = document.getElementById('registerBtn');
        registerBtn.classList.remove('animate__animated', 'animate__rubberBand');
        registerBtn.classList.add('register-btn-hover-out');
    }, 2000)


    //FORM
    const modal = new bootstrap.Modal('#exampleModal', {
        backdrop: true,
        focus: true,
        keyboard: true
    });
    const nameInput = document.querySelector('#name');
    const lastNameInput = document.querySelector('#lastname');
    const emailInput = document.querySelector('#email');
    const birthdateInput = document.querySelector('#birthdate');
    const loginDateInput = document.querySelector('#logindate');
    const jobInput = document.querySelector('#job');
    // const typeInput = document.querySelector('#type');
    // const messageInput = document.querySelector('#message');

    const submitBtn = document.querySelector('#submit');

    function validateEmail(email){
        const valid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
        return valid && !userList.map(u=>u.email.toLowerCase()).includes(email.toLowerCase());
    }
    function validateName(name){
        return name.length>=4
    }

    function validateLastName(lastName){
        return lastName.length>=3
    }

    function validateBirthdate(birthdate){
        console.log("birthdate: ",{birthdate});

        return birthdate !== '';
    }

    function validateLoginDate(loginDate){
        console.log("loginDate: ",{loginDate});

        return loginDate !== '' && moment(birthdateInput.value).add(18, 'y') <= moment(loginDate);
    }

    function validateJob(job){
        return job!=="";
    }

    // function validateMessage(message){
    //     return message.length>=4;
    // }
    //
    // function validateType(type){
    //     return type!=="";
    // }

    function setInputAsValid(inputEl){
        inputEl.classList.remove('is-invalid');
        inputEl.classList.add('is-valid');
    }

    function setInputAsInvalid(inputEl){
        inputEl.classList.add('is-invalid');
        inputEl.classList.remove('is-valid');
    }

    function showMessage(title, message){
        const modalTitleEl = document.querySelector('#exampleModalLabel');
        const modalTextEl = document.querySelector('#modalText');
        modalTitleEl.innerHTML = title;
        modalTextEl.innerHTML = message;
        modal.show();
    }

    Array.from(document.getElementsByClassName('close-modal')).forEach((el) => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            modal.hide();
        })
    })

    function validateForm(){
        let isValid = true;
        const inputs = [
            {
                el: nameInput,
                validateFcn: validateName
            },
            {
                el: lastNameInput,
                validateFcn: validateLastName
            },
            {
                el: emailInput,
                validateFcn: validateEmail
            },
            {
                el: birthdateInput,
                validateFcn: validateBirthdate
            },
            {
                el: loginDateInput,
                validateFcn: validateLoginDate
            },
            {
                el: jobInput,
                validateFcn: validateJob
            },
            // {
            //     el: typeInput,
            //     validateFcn: validateType
            // },
            // {
            //     el: messageInput,
            //     validateFcn: validateMessage
            // }
        ];

        inputs.forEach(input => {
            setInputAsValid(input.el);
            if(!input.validateFcn(input.el.value)){
                setInputAsInvalid(input.el);
                isValid = false;
            }
        })

        return isValid;
    }

    function getFormValue(){
        return {
            name: nameInput.value,
            lastName: lastNameInput.value,
            email: emailInput.value,
            birthDate: birthdateInput.value,
            loginDate: loginDateInput.value,
            job: jobInput.value,
        };
    }

    function insertUser(user){
        user['id'] = lastUserId;
        userList.push(user);
        lastUserId += 1;
        appendUserDiv(user);
        listenUserDelete(user);
    }
    function listenUserDelete(user){
        const deleteBtn = document.getElementById(`deleteUser${user['id']}`);
        deleteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            deleteUser(user);
        });
    }

    function deleteUser(user){
        const userDiv = document.getElementById(`user${user['id']}`)
        userDiv.remove();
        userList = userList.filter(u=>u.id!==user.id);
    }

    function appendUserDiv(user){
        const userListDiv = document.getElementById('userList');
        userListDiv.insertAdjacentHTML('beforeend', `
            <div class="col-12 col-md-6 col-lg-3" data-bs-theme="dark" id="user${user['id']}">
                <div class="card w-100 mb-3 p-3">
                    <button type="button" class="btn-close btn-white text-white ms-auto" id="deleteUser${user['id']}" aria-label="close"></button>
                    <div class="card-body">
                        <h5 class="card-title">${user.name} ${user.lastName}</h5>
                        <p class="card-text text-start fs-6 lh-2 mb-1 mt-3"><strong>Contacto</strong>: </p>
                        <p class="card-text text-start fs-6 lh-2 mb-1">${user.email}</p>
                        <!--<p class="card-text text-start fs-6 lh-2 mb-1 mt-3"><strong>Cumpleaños</strong>:</p>
                        <p class="card-text text-start fs-6 lh-2 mb-1">5 de abril de 1993</p>-->
                        <p class="card-text text-start fs-6 lh-2 mb-1 mt-3"><strong>Cargo</strong>: </p>
                        <p class="card-text text-start fs-6 lh-2 mb-1">${user.job}</p>
                        <p class="card-text text-start fs-6 lh-2 mb-1 mt-3"><strong>Ingreso</strong>: </p>
                        <p class="card-text text-start fs-6 lh-2 mb-1">${moment(user.loginDate).format('LL')}</p>
                    </div>
                </div>
            </div>`
        );
    }

    submitBtn.addEventListener('click', event => {
        event.preventDefault()
        event.stopPropagation()

        if(validateForm()){
            const user = getFormValue();
            insertUser(user);
            console.log("new user: ", user);
            showMessage('Exito!', 'El usuario se ha creado exitosamente.');
        }else{
            showMessage('Error', 'Ups! parece que hubo un error en el formulario. Revise los datos e intente nuevamente.')
        }
    });
});