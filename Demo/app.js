const express = require('express')
const bodyParser = require('body-parser')
const mustacheExpress = require('mustache-express')
const app = express()

var list = {
    elementos: []
};

app.engine('html', mustacheExpress());

app.set('view engine', 'html');

app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({ extended: false }))
 
app.use(express.static(__dirname + '/wwwroot'))

app.use(bodyParser.json());


app.get('/', function (req, res) {

    res.render('agus2.html',query.seleccionarTodo());

})



app.post('/', function (req, res) {
    var si = 0;
    /*if(req.body.descripcion == "seleccionarTodo"){
        query.seleccionarUltimo();
    }*/
    if(req.body.descripcion == "eliminar"){
        command.eliminar(req.body.posicion);
    }
    if(req.body.descripcion != "eliminar" && req.body.descripcion != "subir" && req.body.descripcion != "bajar" && req.body.descripcion != "darVuelta"){
    
        command.agregar(req.body.descripcion);
    }
    if(req.body.descripcion == "subir" && req.body.posicion >0){
        command.subir(req.body.posicion);
    }
    if(req.body.descripcion == "bajar" && req.body.posicion != list.elementos.length-1){
        command.bajar(req.body.posicion);
    }
    if(req.body.descripcion == "darVuelta"){
        command.darVuelta()
        //query.seleccionarUltimo();
        //si = 1;
    }
    //if (si==0){
    query.armarLista(list,res);
    //}
})


// ------------------------------------------ OBJECT QUERY ---------------------------------------


var query = {

    seleccionarTodo(){

        return list;

    },

    seleccionarPosicion(posicion){

        return list.elementos[posicion];
    },

    // ------- METHOD QUERY 
    /*
    seleccionarUltimo (){
        app.get(function (req, res) {
            var nuevaLista = {
                element: []
            };

            nuevaLista.element[0].push(list.elementos[list.elementos.length-1]);
            res.render('agus2.html', nuevaLista);
        
        })
    },
    */
    // ------- METHOD QUERY 1
    mostrar (res){

        res.render('agus2.html',list);
    
    },

    // ------- METHOD QUERY 2

    armarLista(unaLista,res){

        var nuevaLista = {
            elementos: []
        };
        
        for(var i=0; i<unaLista.elementos.length; i++){
        
            
            var item = unaLista.elementos[i];
            nuevaLista.elementos.push({descripcion: item.descripcion, 
            posicion:item.posicion, 
            visualizarsubir: (i!=0),
            visualizarbajar: (i != unaLista.elementos.length-1)})
        
        }
        res.render('agus2.html', nuevaLista);
    }

}

// ------------------------------------------- OBJECT COMMAND ---------------------------------------

var command = {

    // ------- METHOD REORGANIZATION

    reasignarPosiciones(){

        for(var i=0; i<list.elementos.length; i++){
            list.elementos[i].posicion = i;
        }

    },

    // ------- METHOD DELETE

    eliminar(posicionElemento){
        
        list.elementos.splice(posicionElemento,1);

        command.reasignarPosiciones();
        
    },
    // ------- METHOD ADD

    agregar(descripcionElemento){

        list.elementos.push({descripcion:descripcionElemento, posicion:list.elementos.length});

    },

    // ------- METHOD MOVE UP    

    subir(posicionElemento){
        var aux = list.elementos[posicionElemento].descripcion;
        list.elementos[posicionElemento].descripcion = list.elementos[posicionElemento-1].descripcion ; 
        list.elementos[posicionElemento-1].descripcion = aux;
        command.reasignarPosiciones();


    },

    // ------- METHOD MOVE DOWN

    bajar(posicionElemento){
        var aux2 = list.elementos[parseInt(posicionElemento)+parseInt(1)].descripcion;
        list.elementos[parseInt(posicionElemento)+parseInt(1)].descripcion = list.elementos[posicionElemento].descripcion ; 
        list.elementos[posicionElemento].descripcion = aux2;
        command.reasignarPosiciones();

    },

    // ------- METHOD TURN

    darVuelta(){
        list.elementos.reverse();
        command.reasignarPosiciones();

    }
}


app.listen(process.env.PORT || 8080);
