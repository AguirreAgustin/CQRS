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

    query.mostrar(res);

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
    query.armarLista(list,res);
})

 

// ------------------------------------------ OBJECT QUERY ---------------------------------------


var query = {

    // ------- METHOD QUERY 1

    mostrar (res){

        res.render('agus2.html', list);
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

    // ------- METHOD DELETE

    eliminar(reqbody){
        
        list.elementos.splice(reqbody,1);
        for(var i=0; i<list.elementos.length; i++){
            list.elementos[i].posicion = i;
        }
    },
    // ------- METHOD ADD

    agregar(reqbody){

        list.elementos.push({descripcion:reqbody, posicion:list.elementos.length});

    },

    // ------- METHOD MOVE UP    

    subir(reqbody){
        var aux = list.elementos[reqbody].descripcion;
        list.elementos[reqbody].descripcion = list.elementos[reqbody-1].descripcion ; 
        list.elementos[reqbody-1].descripcion = aux;
        for(var i=0; i<list.elementos.length; i++){
            list.elementos[i].posicion = i;
        }

    },

    // ------- METHOD MOVE DOWN

    bajar(reqbody){
        var aux2 = list.elementos[parseInt(reqbody)+parseInt(1)].descripcion;
        list.elementos[parseInt(reqbody)+parseInt(1)].descripcion = list.elementos[reqbody].descripcion ; 
        list.elementos[reqbody].descripcion = aux2;
        for(var i=0; i<list.elementos.length; i++){
            list.elementos[i].posicion = i;
        }
    },

    // ------- METHOD TURN

    darVuelta(){
        list.elementos.reverse();
        for(var i=0; i<list.elementos.length; i++){
            list.elementos[i].posicion = i;
        }
    }
}


app.listen(process.env.PORT || 8080);
