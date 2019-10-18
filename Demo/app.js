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

list.elementos.push({descripcion:'Task 1 Demo',posicion:0});
list.elementos.push({descripcion:'Demo 2 Demo',posicion:1});
list.elementos.push({descripcion:'Demo 3 Demo',posicion:2});

app.get('/', function (req, res) {

    res.render('agus2.html',query.seleccionarTodo());

})

app.get('/api/tarea/:posicion' , function(req ,res){

    res.send(query.seleccionarPosicion(req.params.posicion));

})




app.post('/', function (req, res) {

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
    }
    command.reasignarPosicion()
    res.render('agus2.html',query.seleccionarTodo());
    
})


// ------------------------------------------ OBJECT QUERY ---------------------------------------


var query = {

    // ------- METHOD SELECT ALL

    seleccionarTodo(){

        return list;

    },

    // ------- METHOD SELECT SPECIFIC POSITION 

    seleccionarPosicion(posicion){

        return list.elementos[posicion];
    },

    

}

// ------------------------------------------- OBJECT COMMAND ---------------------------------------

var command = {

    // ------------- METHOD REASIGN POSITION

    reasignarPosicion(unaLista){

        var nuevaLista = {
            elementos: []
        };
        var unaLista = query.seleccionarTodo();

        for(var i=0; i<unaLista.elementos.length; i++){
        
            
            var item = unaLista.elementos[i];
            nuevaLista.elementos.push({descripcion: item.descripcion, 
            posicion:item.posicion, 
            visualizarsubir: (i!=0),
            visualizarbajar: (i != unaLista.elementos.length-1)})
        
        }
        list = nuevaLista;
        query.seleccionarTodo();
    },

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
