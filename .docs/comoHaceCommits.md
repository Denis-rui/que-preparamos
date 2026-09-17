# Resumen

BRANCH
type/short-description

COMMITS
type(scope): description

# Aprender a realizar commits

![alt text](Como-hacer-commits.png)

feat(recipes): add recipe creation form
│ │ │
│ │ └─ description → qué se hizo
│ └─ scope → parte del sistema afectada modulo, archivo, carpeta, etc
└─ type → tipo de cambio

¿Estoy agregando algo nuevo?
→ feat

¿Estoy corrigiendo algo que estaba mal?
→ fix

¿Estoy reorganizando código sin cambiar lo que hace?
→ refactor

¿Solo cambié documentación?
→ docs

¿Solo cambié formato?
→ style

¿Agregué/modifiqué pruebas?
→ test

¿Mejoré rendimiento?
→ perf

¿Toqué dependencias/build?
→ build

¿Toqué GitHub Actions/pipeline?
→ ci

¿Es mantenimiento general?
→ chore

# Crear ramas

| Prefix      | Para qué sirve                   | Ejemplo                     |
| ----------- | -------------------------------- | --------------------------- |
| `feature/`  | Nueva funcionalidad              | `feature/recipe-search`     |
| `fix/`      | Corregir un bug                  | `fix/login-validation`      |
| `hotfix/`   | Corrección urgente en producción | `hotfix/payment-error`      |
| `refactor/` | Reestructurar código             | `refactor/auth-service`     |
| `docs/`     | Documentación                    | `docs/api-documentation`    |
| `test/`     | Pruebas                          | `test/login-tests`          |
| `chore/`    | Mantenimiento/configuración      | `chore/update-dependencies` |
| `ci/`       | CI/CD                            | `ci/github-actions`         |
