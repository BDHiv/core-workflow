class EventState 
{
  constructor(eventName)
  {
    this.name = eventName;
    this.someElemment = 'test';
    this.someThingElse = 123;
  }

  SetLogicOnStage(indexStage, functionLogic)
  {
    console.log("Setting logic to state '%s' on stageIndex: %d", this.name, indexStage);
    
    if (!this.StagesLogic)
       this.StagesLogic = [];

    this.StagesLogic.push({
        idStage:   indexStage,
        action: functionLogic
    });
  }
}

exports.EventState = EventState;