queuedModule("Object Store");
queuedAsyncTest("Creating an Object Store", function(){
    var dbOpenRequest = window.indexedDB.open(DB.NAME, ++dbVersion);
    dbOpenRequest.onsuccess = function(e){
        ok(true, "Database Opened successfully");
        _("Database opened successfully with version " + dbOpenRequest.result.version);
        dbOpenRequest.result.close();
        nextTest();
        start();
    };
    dbOpenRequest.onerror = function(e){
        ok(false, "Database NOT Opened successfully");
        _("Database NOT opened successfully");
        nextTest();
        start();
    };
    dbOpenRequest.onupgradeneeded = function(e){
        ok(true, "Database Upgraded successfully");
        _("Database upgrade called");
        var db = dbOpenRequest.result;
        db.createObjectStore(DB.OBJECT_STORE_1);
        db.createObjectStore(DB.OBJECT_STORE_2, {
            "keyPath": "Int",
            "autoIncrement": true
        });
        db.createObjectStore(DB.OBJECT_STORE_3, {
            "autoIncrement": true
        });
        db.createObjectStore(DB.OBJECT_STORE_4, {
            "keyPath": "Int"
        });
        var objectStore5 = db.createObjectStore(DB.OBJECT_STORE_5);
        equal(db.objectStoreNames.length, 5, "Count of Object Stores created is correct");
        _(db.objectStoreNames);
        start();
        stop();
    };
    
    dbOpenRequest.onblocked = function(){
        ok(false, "Database open is now blocked");
        _("Database open blocked");
        start();
        stop();
    };
});

queuedAsyncTest("Examine Object Store properties", function(){
    var dbOpenRequest = window.indexedDB.open(DB.NAME, dbVersion);
    dbOpenRequest.onsuccess = function(e){
        ok(true, "Database Opened successfully");
        _("Database opened successfully with version " + dbOpenRequest.result.version);
        
        var db = dbOpenRequest.result;
        var transaction = db.transaction([DB.OBJECT_STORE_2]);
        var objectStore = transaction.objectStore(DB.OBJECT_STORE_2);
        
        var propertiesRequest = objectStore.getStoreProperties();
        propertiesRequest.onsuccess = function(event) {
            var props = propertiesRequest.result;
            var pass = true;
            pass &= props.hasOwnProperty("name");
            pass &= props.name === DB.OBJECT_STORE_2;
            
            pass &= props.hasOwnProperty("autoIncrement");
            pass &= props.autoIncrement === true;
            
            pass &= props.hasOwnProperty("indexNames");
            props.indexNames.length === 0;
            
            pass &= props.hasOwnProperty("keyPath");
            pass &= props.keyPath === "Int";
            ok(pass, "Found expected properties");
        };
        
        propertiesRequest.onerror = function(event) {
            ok(false, "Error trying to get store properties");
        };
        
        db.close();
        nextTest();
        start();
    };
    dbOpenRequest.onerror = function(e){
        ok(false, "Database NOT Opened successfully");
        _("Database NOT opened successfully");
        nextTest();
        start();
    };
    dbOpenRequest.onupgradeneeded = function(e){
        ok(false, "current database was expected");
        _("current database was expected");
        start();
        stop();
    };
    
    dbOpenRequest.onblocked = function(){
        ok(false, "Database open is now blocked");
        _("Database open blocked");
        start();
        stop();
    };
});

queuedAsyncTest("Deleting an Object Store", function(){
    var dbOpenRequest = window.indexedDB.open(DB.NAME, ++dbVersion);
    dbOpenRequest.onsuccess = function(e){
        ok(true, "Database Opened successfully");
        _("Database opened successfully with version");
        dbOpenRequest.result.close();
        start();
        nextTest();
    };
    dbOpenRequest.onerror = function(e){
        ok(false, "Database NOT Opened successfully");
        _("Database NOT opened successfully");
        start();
        nextTest();
    };
    dbOpenRequest.onupgradeneeded = function(e){
        ok(true, "Database Upgraded successfully, now trying to delete the database");
        _("Database upgrade called");
        var db = dbOpenRequest.result;
        var len = db.objectStoreNames.length;
        db.deleteObjectStore(DB.OBJECT_STORE_5);
        for (var i = 0; i < db.objectStoreNames.length; i++) {
            if (db.objectStoreNames[i] === DB.OBJECT_STORE_5) {
                ok(fail, "Database should not not contain Object Store 5");
            }
        }
        start();
        stop();
    };
    
    dbOpenRequest.onblocked = function(e){
        ok(false, "Database open request blocked");
        _("Database open blocked");
        start();
        stop();
    };
});
