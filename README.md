# multi-container-complex

Contains 3 components

- Frontend / client

- Backend / server

- Async Job / worker

These 3 components interact with Postgres & Redis Databases

```powershell
# To force restart docker
wsl --terminate docker-desktop
wsl --terminate docker-desktop-data
```

```bash
kubectl apply -f ingress-service.yaml
kubectl port-forward --namespace=ingress-nginx service/ingress-nginx-controller 8080:80
```
