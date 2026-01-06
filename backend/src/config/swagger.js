import path from "path";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

const specPath = path.resolve(process.cwd(), "backend/src/docs/openapi.yaml");
const swaggerSpec = YAML.load(specPath);

export default function setupSwagger(app) {
  const enabled =
    process.env.NODE_ENV == "production" ||
    process.env.SWAGGER_ENABLE === "true";
  if (!enabled) return;
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, { explorer: true })
  );
}
