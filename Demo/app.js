const express = require('express')
const bodyParser = require('body-parser')
const mustacheExpress = require('mustache-express')
const app = express()

var list = {
    elementos: []
};

//list.elementos.push({descripcion:'Demostración'});
list.elementos.push({descripcion:'Demostración1',posicion:0});
list.elementos.push({descripcion:'Demostración2',posicion:1});
list.elementos.push({descripcion:'Demostración3',posicion:2});

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

 


var query = {


    mostrar (res){

        res.render('agus2.html', list);
    },
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


var command = {

    eliminar(reqbody){
        
        list.elementos.splice(reqbody,1);
        for(var i=0; i<list.elementos.length; i++){
            list.elementos[i].posicion = i;
        }
    },
    
    agregar(reqbody){

        list.elementos.push({descripcion:reqbody, posicion:list.elementos.length});

    },

    subir(reqbody){
        var aux = list.elementos[reqbody].descripcion;
        list.elementos[reqbody].descripcion = list.elementos[reqbody-1].descripcion ; 
        list.elementos[reqbody-1].descripcion = aux;
        for(var i=0; i<list.elementos.length; i++){
            list.elementos[i].posicion = i;
        }

    },

    bajar(reqbody){
        var aux2 = list.elementos[parseInt(reqbody)+parseInt(1)].descripcion;
        list.elementos[parseInt(reqbody)+parseInt(1)].descripcion = list.elementos[reqbody].descripcion ; 
        list.elementos[reqbody].descripcion = aux2;
        for(var i=0; i<list.elementos.length; i++){
            list.elementos[i].posicion = i;
        }
    },

    darVuelta(){
        list.elementos.reverse();
        for(var i=0; i<list.elementos.length; i++){
            list.elementos[i].posicion = i;
        }
    }
}


app.listen(process.env.PORT || 8080);
