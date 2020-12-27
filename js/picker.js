class Picker {
    constructor(parent = '.picker') {
        this.parent = parent;
        this.correctNextMonth = this.correctNextMonth.bind(this);
        this.correctPrevMonth = this.correctPrevMonth.bind(this);
        this.maxDays = this.daysInMonths();
        this.prevDays = this.prevEmptyDays();
        this.restDays = this.restEmptyDays();
    }

    _state = {
        dayNames:['Пн','Вт','Ср','Чт','Пт','Сб','Вс'],
        monthsNames: ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
        date: new Date(),
    }

    // Сколько первых пустых дней
    prevEmptyDays(){
        let date = new Date(this.state.year,this.state.month, 1).getDay();
        if(date === 0) date = 7;
        return date - 1;
    }

    // Сколько последних пустых дней
    restEmptyDays(){
        let date = new Date(this.state.year,this.state.month, this.daysInMonths()).getDay();
        // if(date === 0) date = 7;
        return 7 - date;
    }

    //Сколько дней в месяце
    daysInMonths(){
        return 32 - new Date(this.state.year, this.state.month, 32).getDate()
    }

    // Устанавливает год по дефолту, тоесть текущий
    setYear(){
        document.querySelector('.picker__year').innerHTML = this.state.year;
    }

    // Устанавливает месяц по дефолту, тоесть текущий
    setMonth(){
        document.querySelector('.picker__currentMonth').innerHTML = this.state.monthsNames[this.state.month]
    }

    // Задать предыдущий месяц
    correctPrevMonth(){
        let year = this.state.year;
        let number = --this.state.month;

        if(number < 0) {
            number = 11;
            --year;
            document.querySelector('.picker__year').innerHTML = '';
            this.correctYear = year;
            this.setYear()
        }

        this.correctMonth = number;
        document.querySelector('.picker__currentMonth').innerHTML = '';
        document.querySelector('.picker__days_container').innerHTML = '';
        this.createPickerDays()
        this.setMonth();
    }

    // Задать следующий месяц
    correctNextMonth(){
        let year = this.state.year;
        let number = ++this.state.month;

        if(number > 11) {
            number = 0;
            ++year;
            document.querySelector('.picker__year').innerHTML = '';
            this.correctYear = year;
            this.setYear()
        }
        //С помощью сеттера устанавливаем новое знаечние
        this.correctMonth = number;
        document.querySelector('.picker__currentMonth').innerHTML = '';
        document.querySelector('.picker__days_container').innerHTML = '';
        this.createPickerDays()
        this.setMonth();
    }

    //Создать дни месяца
    createPickerDays(){
        const parent = document.querySelector('.picker__days_container');
        const prevMonthMaxDays = 32 - new Date(this.state.year, this.state.month - 1, 32).getDate()
        const startEmpty = this.prevEmptyDays();
        const endEmpty = this.restEmptyDays();
        const days = this.daysInMonths();

        let startCounter = 0, endCounter = 1, daysCounter = 1;
        // Добавляем пустые дни с начала календаря
        while(startCounter < startEmpty){
            const div = document.createElement('div');
            const span = document.createElement('span');
            div.classList.add('picker__empty', 'picker__day')
            span.innerHTML = prevMonthMaxDays - startCounter;
            div.appendChild(span)
            parent.prepend(div)
            startCounter++;
        }
        //Добавляем дни текущего месяца
        while(daysCounter <= days){
            const div = document.createElement('div');
            const span = document.createElement('span');
            const currentDay = this.state.date.getDate()
            const stateMonth = this.state.month;
            const currentMonth = new Date().getMonth();
            const stateYear = this.state.year;
            const currentYear = new Date().getFullYear();

            //Проверяем являеться ли текущий день днем текущего месяца и отмечаем сегодняшний день
            if(daysCounter === currentDay && stateMonth === currentMonth && stateYear === currentYear){
                const current = document.createElement('span')
                current.innerHTML = 'Сегодня'
                current.classList.add('span_current')
                div.prepend(current)
                div.classList.add('p_current')
            }

            div.classList.add( 'picker__day')
            span.innerHTML = daysCounter;
            div.appendChild(span)
            parent.appendChild(div);
            daysCounter++;
        }
        //Добавляем пустые ячейки в конец месяца
        while(endCounter <= endEmpty){
            const div = document.createElement('div');
            const span = document.createElement('span');
            div.classList.add('picker__empty', 'picker__day')
            span.innerHTML = endCounter;
            div.appendChild(span)
            parent.appendChild(div);
            endCounter++
        }
    }

    get state(){
        return this._state;
    }

    // Сеттер для установки нового значения
    set correctYear(value){
        this._state.year = value;
    }

    // Сеттер для установки нового значения
    set correctMonth(value){
        this._state.month = value;
    }

    // Создает основную верстку - НЕ устанавливает какие либо значения
    createMarkup(){
        let parent = document.querySelector(this.parent)
        // Create year
        let year = document.createElement('div');
        year.classList.add('picker__year');
        parent.prepend(year)

        //Create month
        let month = document.createElement('div');
        let leftArrow = document.createElement('div');
        let rightArrow = document.createElement('div');
        let currentMonth = document.createElement('div');

        month.classList.add('picker__month');
        leftArrow.classList.add('picker__left_arrow');
        currentMonth.classList.add('picker__currentMonth');
        rightArrow.classList.add('picker__right_arrow');

        month.appendChild(leftArrow);
        month.appendChild(currentMonth);
        month.appendChild(rightArrow);
        parent.appendChild(month);

        //Create dayNames
        let dayNamesCont = document.createElement('div');
        dayNamesCont.classList.add('picker__dayNames_container');

        this.state.dayNames.forEach(item => {
            let day = document.createElement('div');
            day.classList.add('picker__dayName');
            day.innerHTML = item;
            dayNamesCont.appendChild(day)
        })
        parent.appendChild(dayNamesCont)

        //Container for days
        let daysCont = document.createElement('div')
        daysCont.classList.add('picker__days_container')
        parent.appendChild(daysCont)
    }

    // Вешаем обработчики - последняя функция перед "calendar.create()"
    createListeners(){
        document.querySelector('.picker__left_arrow').onclick = this.correctPrevMonth;
        document.querySelector('.picker__right_arrow').onclick = this.correctNextMonth;
    }

    create(){
        this.createMarkup();
        this.setYear();
        this.setMonth();
        this.createPickerDays();
        this.createListeners();

    }
};

const calendar = new Picker('.picker');
calendar.create();