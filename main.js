
/*==================================================

   API

 ***************************************************/

/**
 * Get the data from the namegame endpoint.
 *
 * The data comes back in the format:
 *
 *    [
 *        { name: 'Viju Legard', url: '...' },
 *        { name: 'Matt Seibert', url: '...' },
 *        ...
 *    ]
 */
function getPersonList() {
    return new Promise((resolve, reject) => {
        fetch('http://api.namegame.willowtreemobile.com/').then(function(response) {
            if (response.status !== 200) {
                reject(new Error("Error!"));
            }

            response.json().then((imageList) => {
                // Add last name property to make future functions easier
                imageList.forEach((person) => {
                    person.lastName = getLastName(person.name);
                })
                resolve(imageList);
            });
        });
    });
}


/*==================================================

   DATA TRANSFORMS

 ***************************************************/

// change to es6 style function to keep style similiar throughout js file. 

const getLastName = (fullName) => {
    return fullName.match(/\w+/g)[1];
};

const getFirstName = (fullName) => {
    return fullName.match(/\w+/g)[0];
};

/**
 * Fisher-Yates shuffle
 */
function shuffleList(list) {
    // Make a copy & don't mutate the passed in list
    // slice starts at second entry, changed to start at first
    let result = list.slice(0);

    // declare variables in loop since that is the only time they are used.

    for (let i = list.length - 1; i > 0; i -= 1) {
        let j = Math.floor(Math.random() * (i + 1));
        let tmp = list[i];
        list[i] = list[j];
        list[j] = tmp;
    }

    return result;
}


/**
 * Remove any people that do not have the name we are
 * searching for.
 */
 // make search term and name case insensitive.
function filterByName(searchForName, personList) {
    searchForName = searchForName.toLowerCase();
    return personList.filter((person) => {
        console.log(person)
        // Only needs to check if letters typed so far are included in name, not equal to name. 
        return person.name.toLowerCase().includes(searchForName);
    });
}


/**
 * Takes in a property of an object list, e.g. "name" below
 *
 *    people = [{ name: 'Sam' }, { name: 'Jon' }, { name: 'Kevin' }]
 *
 * And returns a function that will sort that list, e.g.
 *
 *    const sortPeopleByName = sortObjListByProp('name');
 *    const sortedPeople = sortPeopleByName(people);
 *
 *  We now have:
 *
 *    console.log(sortedPeople)
 *    > [{ name: 'Jon' }, { name: 'Kevin' }, { name: 'Sam' }]
 *
 */
function sortObjListByProp(prop) {
    return function(objList) {
        // Make a copy & don't mutate the passed in list
        // objList is slicing off first element. Fixed so it keeps everything.
        let result = objList.slice(0);

        result.sort((a, b) => {
            // change to else if, as both will never be true simultaneously.
            if (a[prop] < b[prop]) {
                return -1;
            } else if (a[prop] > b[prop]) {
                return 1;
            }
            // should return 0 if equal
             return 0;
        });

        return result;
    };
}

const sortByFirstName = sortObjListByProp('name');

// SortByLastName does not work as intended. It actually just reverses a sort by first name
const sortByLastName = sortObjListByProp('lastName');

/*==================================================

   VIEW (React)

 ***************************************************/

const Search = (props) => React.DOM.input({
    type: 'input',
    onChange: props.onChange
});

const Thumbnail = (props) => React.DOM.img({
    className: 'image',
    src: props.src
});

const ListRow = (props) => React.DOM.tr({ key: props.person.name }, [
    React.DOM.td({ key: 'thumb' }, React.createElement(Thumbnail, { src: props.person.url })),
    React.DOM.td({ key: 'first' }, null, getFirstName(props.person.name)),
    React.DOM.td({ key: 'last' }, null, getLastName(props.person.name)),
]);

const ListContainer = (props) => React.DOM.table({ className: 'list-container' }, [
    React.DOM.thead({ key: 'thead' }, React.DOM.tr({}, [
        React.DOM.th({ key: 'thumb-h' }, null, 'Thumbnail'),
        React.DOM.th({ key: 'first-h' }, null, 'First Name'),
        React.DOM.th({ key: 'last-h' }, null, 'Last Name')
    ])),
    React.DOM.tbody({ key: 'tbody' }, props.personList.map((person, i) =>
        React.createElement(ListRow, { key: `person-${i}`, person })))
]);

const App = React.createClass({
    getInitialState() {
        return {
            personList: [],
            visiblePersonList: []
        };
    },

    componentDidMount() {
        getPersonList().then((personList) =>
            this.setState({
                personList,
                visiblePersonList: personList
            }));
    },

    _shuffleList() {
        this.setState({
            visiblePersonList: shuffleList(this.state.personList)
        });
    },

    _sortByFirst() {
        this.setState({
            visiblePersonList: sortByFirstName(this.state.personList)
        });
    },

    _sortByLast() {
        this.setState({
            visiblePersonList: sortByLastName(this.state.personList)
        });
    },

    _onSearch(e) {
        this.setState({
            visiblePersonList: filterByName(e.target.value, this.state.personList)
        });
    },

    render() {
        const { visiblePersonList } = this.state;

        return React.DOM.div({ className: 'app-container' }, [
            React.createElement(Search, { key: 'search', onChange: this._onSearch }),
            React.DOM.button({ key: 'shuffle', onClick: this._shuffleList }, null, 'Shuffle'),
            React.DOM.button({ key: 'sort-first', onClick: this._sortByFirst }, null, 'Sort (First Name)'),
            React.DOM.button({ key: 'sort-last', onClick: this._sortByLast }, null, 'Sort (Last Name)'),
            React.createElement(ListContainer, { key: 'list', personList: visiblePersonList })
        ]);
    }
});

ReactDOM.render(
    React.createElement(App),
    document.getElementById('app')
);

