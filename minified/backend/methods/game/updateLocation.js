const players=require("../../db/players"),locations=require("../../db/locations"),{locationSchema:locationSchema}=require("../../schemas/game");async function updateLocation(a,e){try{await locationSchema.validate(a.body);const t=await players.findOne({_id:a.body.player_id});if(t){const i=await locations.insert({location:a.body.location,date:new Date,player_id:t._id,game_id:t.game_id}),o=await players.findOneAndUpdate({_id:t._id},{$set:{location_id:i._id}});return void e.send({status:"success",updated:o})}return void e.send({status:"error",message:"The player was not found!"})}catch(a){return void e.send(a)}}module.exports=updateLocation;