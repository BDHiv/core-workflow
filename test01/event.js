var destiny = require('./destiny');
var eventState = require('./eventState');

class Event {
  constructor(mainObject) {
    this.MainObject = mainObject;
    this.Destiny =  new destiny.Destiny();
    this.CurrentStage = new destiny.DestinyStage();
    this.CurrentState = new eventState.EventState();
    this.stageIndex = -1;
  }
  
  
ApplyCondition(condition)  
{
    if (!condition.target)
      throw new Error("Target not defined on condition!");

      //create a conditions dictionary to call on condition.target when its  value changed
}


  SetStates(...states)
  {
    this.States = []; //una lista de estados de evento
    states.forEach(function (element) {
      var state = new eventState.EventState(element);
      this.States.push(state);
    }, this);
  }

  SetCurrentState(newState)
  {
     var oldState = this.CurrentState;
     this.CurrentState =  this.States[newState];
     console.log("STATE change to: " + this.CurrentState.name);
     this.manageChangeState(oldState);     
  }

  manageChangeState(oldState)
  {
      if (this.CurrentState.doLogic)
      {
        console.log('\tState have logic!')
        this.CurrentState.doLogic(this);
      }
  }

  SetDestiny(destiny)
  {
    this.Destiny = destiny;
  }

  SetUserProfiles(...profiles)
  {
    this.Profiles = [];
    profiles.forEach(function (element) { //una lista de perfiles de usuario
      var profile = new UserProfile(element);
      this
        .Profiles
        .push(profile);
    }, this);
  }

 // get area() {
   // return this.Next();
 // }

  Back() 
  {
        if (!this.Destiny || !this.Destiny.Stages || this.Destiny.Stages.length == 0)
        {
          console.log("\t\t %s event have no stages!", this.name);
          return;
        }
        
        this.stageIndex--;       
     
        this.CurrentStage = this.Destiny.Stages[this.stageIndex];
        console.log("NEXT STAGE down to: " + this.CurrentStage.name);
        this.manageChangeStage(this.stageIndex - 1, this.stageIndex);
     
      // todo: validar que no sobrepase el lengt
  }

  NextToStage(indexStage)
  {
    //goto X stage

  }

  Next()
   {  
      if (!this.Destiny || !this.Destiny.Stages || this.Destiny.Stages.length == 0)
        {
          console.log("\t\t %s event have no stages!", this.name);
          return;
        }

        this.stageIndex++;       
     
        this.CurrentStage = this.Destiny.Stages[this.stageIndex];
        console.log("Next STAGE to: %d.- %s ",this.stageIndex, this.CurrentStage.name);
        this.manageChangeStage(this.stageIndex - 1, this.stageIndex);
     
      // todo: validar que no sobrepase el length
  }

  SetStageLogic(indexStage, logicFunction)
  {
     this.Destiny.Stages[indexStage].doLogic = logicFunction;
  }

  SetStateAndStageLogic(indexStage, indexState, logicFunction)
  {
     this.States[indexState].SetLogicOnStage(indexStage, logicFunction);
  } 

  SetStateLogic(indexState, logicFunction)
  {
     this.States[indexState].doLogic = logicFunction;
  }
  
  manageChangeStage(old, newStageIndex)
  {       
      if (this.Destiny.Stages[newStageIndex].doLogic)
      {
        console.log('\tStage have logic!')
        this.Destiny.Stages[newStageIndex].doLogic(this);
      }

    if (this.CurrentState.StagesLogic)
    {
        var stageLogic = this.CurrentState.StagesLogic.filter(function(x) 
        { 
          return x.idStage = newStageIndex
        });

     

      if (stageLogic)
      {
          stageLogic[0].action(this);
      }
    }

      
      //if (this.CurrentState.StagesLogic) StagesLogic
//  console.log(this.Stat);
     // if (this.CurrentState.StagesLogic)
  }

  Stop()
  {

  }

  Start(fromEvent)
  {
     console.log("");
    console.log("Starting %s workflow!!...", this.name);
    if (this.stageIndex > -1)
      throw new Error("Event doesn't finished yet!");

    if (this.onStart)
    {
       console.log('\tStart have logic!')
       this.onStart(fromEvent);
    }

    this.Next();    
  }

  ContinueWith(newEvent)
  {
     console.log("");
     console.log("Continue with event: %s", newEvent.name);   
     newEvent.Start(this);    
  }

  AlertTo(roles)
  {
      console.log('\t\tSend notifications to users in roles: %s', roles);
      //send prefixed notifications to all users in roles according some predefined text message
  }

  MessageTo(targetInformations, message)
  {
     console.log('\t\tSend message: %s to: %s', message,targetInformations);
      //send notifications to all users in roles with a free message
  }
}

class UserProfile {
  constructor(userProfileName)
  {
    this.name = userProfileName;
    // this.someElemment = 'test'; 
    //this.someThingElse = 123;
  }
}


exports.Event = Event;