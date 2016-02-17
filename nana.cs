namespace Name
{
    public class {
 public string find(string databaseName, string collectionName, string
query)
         {
             var db = server.GetDatabase(databaseName);
             var collection = db.GetCollection(collectionName);

             BsonDocument bsonDoc =
MongoDB.Bson.Serialization.BsonSerializer.Deserialize<BsonDocument>(query);

             var result = collection.Find(new QueryDocument(bsonDoc));

             if (result != null)
             {
                 return result.ToJson();
             }
             else
             {
                 return “{}”;
             }
         }
 
}
    
}
