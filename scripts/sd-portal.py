from modules import script_callbacks, scripts

base_dir = scripts.basedir()


def app_started(_, app):
    @app.get("/api/sd-portal")
    async def portal():
        return {
            "dir": base_dir,
        }


script_callbacks.on_app_started(app_started)
