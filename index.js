document.onreadystatechange = function () {
    if (document.readyState === 'interactive') {

        document.getElementById('catTodo').onclick = function (){
            selectCat('Todo');
        }
        document.getElementById('catDoing').onclick = function (){
            selectCat('Doing');
        }
        document.getElementById('catDone').onclick = function (){
            selectCat('Done');
        }

        let category = ['Todo','Doing','Done'];
        function selectCat(selected){
            for(let i in category){
                removeClass(document.getElementById('cat' + category[i]), 'catSelected');
                removeClass(document.getElementById('scrollWrapper'), 'page' + category[i]);
                removeClass(document.getElementById(category[i].toLowerCase() + 'Wrapper'), 'activeSection');
            }
            addClass(document.getElementById('cat' + selected), 'catSelected');
            addClass(document.getElementById('scrollWrapper'), 'page' + selected);
            addClass(document.getElementById(selected.toLowerCase() + 'Wrapper'), 'activeSection');
        }
    }
}