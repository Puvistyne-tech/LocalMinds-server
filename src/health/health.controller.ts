import { Controller, Get } from "@nestjs/common";
import { HealthService } from "./health.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { HealthCheck, HealthCheckService } from "@nestjs/terminus";

@ApiTags("health")
@Controller("health")
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private healthService: HealthService
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: "Check server health status" })
  @ApiResponse({
    status: 200,
    description: "Server is healthy",
    schema: {
      example: {
        status: "ok",
        info: {
          mongodb: {
            status: "up",
            responseTime: 50,
          },
        },
        error: {},
        details: {
          mongodb: {
            status: "up",
            responseTime: 50,
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 503,
    description: "Server is not healthy",
    schema: {
      example: {
        status: "error",
        info: {},
        error: {
          mongodb: {
            status: "down",
            error: "Database not connected",
          },
        },
        details: {
          mongodb: {
            status: "down",
            error: "Database not connected",
          },
        },
      },
    },
  })
  async check() {
    const startTime = Date.now();
    const mongoHealth = await this.healthService.checkMongoDB();
    const healthCheck = {
      status: mongoHealth.mongodb.status === "up" ? "ok" : "error",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      processId: process.pid,
      platform: process.platform,
      memoryUsage: process.memoryUsage(),
      responseTime: Date.now() - startTime,
      ...mongoHealth,
    };
    console.log(
      "==================================== Health Check =====================================",
      healthCheck
    );
    return healthCheck;
  }
}
