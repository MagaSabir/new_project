import { SETTINGS } from "./settings";
import {app} from "./app";
import {runDb} from "./db/mongoDb";


const runApp  = async () => {

  app.listen(SETTINGS.PORT, () => {
    console.log(`Server running on port ${SETTINGS.PORT}`);
    runDb()
  });

}
runApp()