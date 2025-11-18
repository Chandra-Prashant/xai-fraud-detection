(fraud_api) prashantchandra@Prashants-MacBook-Air backend % uvicorn app.main:app --reload
INFO:     Will watch for changes in these directories: ['/Users/prashantchandra/fraud-detection-system/backend']
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [7849] using WatchFiles
INFO:     Started server process [7851]
INFO:     Waiting for application startup.
Loading ML models, scalers, and explainer...
Loading background data for SHAP...
Creating SHAP TreeExplainer...
Successfully loaded 2 models, 2 scalers, and 1 explainer.
INFO:     Application startup complete.
INFO:     127.0.0.1:50773 - "POST /predict HTTP/1.1" 200 OK
INFO:     127.0.0.1:50773 - "POST /explain HTTP/1.1" 500 Internal Server Error
ERROR:    Exception in ASGI application
Traceback (most recent call last):
  File "/opt/anaconda3/envs/fraud_api/lib/python3.10/site-packages/uvicorn/protocols/http/httptools_impl.py", line 409, in run_asgi
    result = await app(  # type: ignore[func-returns-value]
  File "/opt/anaconda3/envs/fraud_api/lib/python3.10/site-packages/uvicorn/middleware/proxy_headers.py", line 60, in __call__
    return await self.app(scope, receive, send)
  File "/opt/anaconda3/envs/fraud_api/lib/python3.10/site-packages/fastapi/applications.py", line 1134, in __call__
    await super().__call__(scope, receive, send)
  File "/opt/anaconda3/envs/fraud_api/lib/python3.10/site-packages/starlette/applications.py", line 113, in __call__
    await self.middleware_stack(scope, receive, send)
  File "/opt/anaconda3/envs/fraud_api/lib/python3.10/site-packages/starlette/middleware/errors.py", line 186, in __call__
    raise exc
  File "/opt/anaconda3/envs/fraud_api/lib/python3.10/site-packages/starlette/middleware/errors.py", line 164, in __call__
    await self.app(scope, receive, _send)
  File "/opt/anaconda3/envs/fraud_api/lib/python3.10/site-packages/starlette/middleware/cors.py", line 93, in __call__
    await self.simple_response(scope, receive, send, request_headers=headers)
  File "/opt/anaconda3/envs/fraud_api/lib/python3.10/site-packages/starlette/middleware/cors.py", line 144, in simple_response
    await self.app(scope, receive, send)
  File "/opt/anaconda3/envs/fraud_api/lib/python3.10/site-packages/starlette/middleware/exceptions.py", line 63, in __call__
    await wrap_app_handling_exceptions(self.app, conn)(scope, receive, send)
  File "/opt/anaconda3/envs/fraud_api/lib/python3.10/site-packages/starlette/_exception_handler.py", line 53, in wrapped_app
    raise exc
  File "/opt/anaconda3/envs/fraud_api/lib/python3.10/site-packages/starlette/_exception_handler.py", line 42, in wrapped_app
    await app(scope, receive, sender)
  File "/opt/anaconda3/envs/fraud_api/lib/python3.10/site-packages/fastapi/middleware/asyncexitstack.py", line 18, in __call__
    await self.app(scope, receive, send)
  File "/opt/anaconda3/envs/fraud_api/lib/python3.10/site-packages/starlette/routing.py", line 716, in __call__
    await self.middleware_stack(scope, receive, send)
  File "/opt/anaconda3/envs/fraud_api/lib/python3.10/site-packages/starlette/routing.py", line 736, in app
    await route.handle(scope, receive, send)
  File "/opt/anaconda3/envs/fraud_api/lib/python3.10/site-packages/starlette/routing.py", line 290, in handle
    await self.app(scope, receive, send)
  File "/opt/anaconda3/envs/fraud_api/lib/python3.10/site-packages/fastapi/routing.py", line 125, in app
    await wrap_app_handling_exceptions(app, request)(scope, receive, send)
  File "/opt/anaconda3/envs/fraud_api/lib/python3.10/site-packages/starlette/_exception_handler.py", line 53, in wrapped_app
    raise exc
  File "/opt/anaconda3/envs/fraud_api/lib/python3.10/site-packages/starlette/_exception_handler.py", line 42, in wrapped_app
    await app(scope, receive, sender)
  File "/opt/anaconda3/envs/fraud_api/lib/python3.10/site-packages/fastapi/routing.py", line 111, in app
    response = await f(request)
  File "/opt/anaconda3/envs/fraud_api/lib/python3.10/site-packages/fastapi/routing.py", line 391, in app
    raw_response = await run_endpoint_function(
  File "/opt/anaconda3/envs/fraud_api/lib/python3.10/site-packages/fastapi/routing.py", line 290, in run_endpoint_function
    return await dependant.call(**values)
  File "/Users/prashantchandra/fraud-detection-system/backend/app/main.py", line 166, in explain
    feature_impacts = [
  File "/Users/prashantchandra/fraud-detection-system/backend/app/main.py", line 167, in <listcomp>
    ExplainFeature(feature=col, impact=val)
  File "/opt/anaconda3/envs/fraud_api/lib/python3.10/site-packages/pydantic/main.py", line 250, in __init__
    validated_self = self.__pydantic_validator__.validate_python(data, self_instance=self)
pydantic_core._pydantic_core.ValidationError: 1 validation error for ExplainFeature
impact
  Input should be a valid number [type=float_type, input_value=array([ 6.6666663e-06, -6.6666663e-06]), input_type=ndarray]
    For further information visit https://errors.pydantic.dev/2.12/v/float_type

