const teamsSchema=require("../../schemas/team"),teams=require("../../db/teams");async function addTeam(e,a){try{await teamsSchema.validate(e.body);const s=await teams.insert({name:e.body.name,game_id:e.body.game_id,point:0,color:e.body.color});a.send({status:"success",team:s})}catch(e){e.message.startsWith("E11000")&&(e.message="This gas has already been created!"),a.send(e)}}module.exports=addTeam;