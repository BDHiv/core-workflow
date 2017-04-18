var prompt = require('prompt');
var util = require('util');
var mainEvent = require('./event');
var mainDestiny = require('./destiny');
const readline = require('readline');
const rl = readline.createInterface({input: process.stdin, output: process.stdout});

// --------------------------
const eventRechazar = new mainEvent.Event();  //a event without stages or states
eventRechazar.name = "-= Rechazar Encomienda =-";
eventRechazar.description = "rechazo de un paquete por X motivo";
eventRechazar.onStart = function (e) {
        console.log('\tOn start REJECTED event');   
    var msg = "Dear user this item was rejected: " + e.MainObject.description + ", on stage : " + e.CurrentStage.name;
    e.MessageTo("someEmails@gmail.com", msg);
}
// --------------------------

var solicitud = { //may be anything, even an array
    description: 'mesa de ping pong',
    width: 100.45,
    weight: 100,
    length: 300.67,
    price: 1000
}

//must order be important !!
var destinys = new mainDestiny.Destiny("Ensure storage amount", 
        "Send to customs", 
        "Send to airport", 
        "Send to client", 
        "Received by client");

// ********************************** CONFIGURE WORKFLOW *******************************
const eventEnviar = new mainEvent.Event(solicitud);
eventEnviar.name = "-= Enviar Encomienda =-";
eventEnviar.description = "envio de un paquete hacia su destinatario";
eventEnviar.SetStates('StockRevision', 'Rejected', 'Send', 'Received');
eventEnviar.SetUserProfiles('Storage Supervisor', 'Customs Supervisor', 'Transporter', 'Destination Client');

// destiny.Stages[1].doLogic = function(){     console.log('\tdo logic from
// destiny'); };
eventEnviar.SetDestiny(destinys);

eventEnviar.States[0].doLogic = function (e) { //at first STATE StockRevision do....
    console.log('\tDo logic from event state change, current state: %s', e.CurrentState.name);
    // e.AlertTo('Storage Supervisor')
};

eventEnviar.SetStageLogic(0, function (e) { //at first stage step do....
    console. log('\tDo logic from event stage change, current stage: %s', e.CurrentStage.name);     
    e.AlertTo('Storage Supervisor')
    e.SetCurrentState(0); //change to StockRevision state
}); 

eventEnviar.SetStageLogic(1, function (e) { //at 'Send to Custom' stage step do....   
   console.log("\tWhen stage equals 'Send to Custom' then do this...");   
    e.SetCurrentState(2);  //set state to 'Send'
    e.AlertTo('Transporters');
}); 

eventEnviar.States[2].doLogic = function (e) { //when state equals 2, mean 'Send' state, do this
    console.log("\tWhen state equals 'Send' then do this...");
    // e.AlertTo('Storage Supervisor')
};

eventEnviar.SetStateAndStageLogic(1,2, function(e){  //a state/stage relation logic to perform
    // 1 = 'Send to Customs' Stage
    // 2 = 'Send' State
   console.log("\t\tOn Current stage: '%s', also on current state: '%s' then do this!!...",
         e.CurrentStage.name, e.CurrentState.name);
});

// ********************************** START WORKFLOW *******************************
eventEnviar.Start();

 rl.question('USER INTERACTION = 1: Hay Stock, 2: No Hay Stock ', (answer) => 
    {
        if (answer == 2) {
            // no product inventary logic supervisor   
            eventEnviar.SetCurrentState(1); //Rejected 
            eventRechazar.description = "sin inventario";                     
            eventEnviar.ContinueWith(eventRechazar);
        }
        if(answer == 1) {
            eventEnviar.MainObject.price = 3990;
             eventEnviar.Next(); //stage 'Send to custom'

        }
        rl.close();
    });



// TODO:

var condition = 'if [valor] > 10 then if[]';


var condition2 = 
    {
        target : solicitud.price,
        name : 'some description',
         equals : {  
             value : null,
            action : null,
            operator : '=='
          }
    }


var condition = 
    {
        target : solicitud.price,
        name : 'some description',
        // equals : {  
        //     value : null,
        //     action : null,
        //     operator : '=='
        //  },
         greaterThan : {
            value : 3000,
            action : function(e) //e become the main event 
            {   
                eventRechazar.descripcion = "precio no recomendable"; 
                e.AlertTo('Transporter');                    
                e.ContinueWith(eventRechazar);
            },
            operator : '>'
         }
        //  lessThan : {
        //     value : null,
        //     action : null,
        //     operator : '<'
        //  },
        //  notEquals : {
        //     value : null,
        //     action : null,
        //     operator : '!='
        //  }, 
        //  graterEqualsThan : {
        //     value : 3000,
        //     action : null,
        //     operator : '>='
        //  },
        //  lessEqualsThan : {
        //     value : null,
        //     action : null,
        //     operator : '<='
        //  }
    }

//eventEnviar.ApplyCondition(condition);