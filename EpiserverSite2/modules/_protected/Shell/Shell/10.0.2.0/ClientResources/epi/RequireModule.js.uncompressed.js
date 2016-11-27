define("epi/RequireModule", [
    "dojo/when",
    "epi/dependency"
], function (
    when,
    dependency
) {
    return {

        load: function (/*String*/id, /*function*/require, /*function*/load) {

            var moduleManager = dependency.resolve("epi.ModuleManager");

            when(moduleManager.startModules(id), function () {

                return load(moduleManager.getModule(id));
            });
        }
    };
});
