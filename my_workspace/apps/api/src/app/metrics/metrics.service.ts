import { Injectable } from '@nestjs/common';
import { collectDefaultMetrics, Registry } from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly register: Registry;

  constructor() {
    this.register = new Registry();
    this.register.setDefaultLabels({
      app: 'monorepo-api'
    });
    collectDefaultMetrics({ register: this.register });
  }

  getMetrics() {
    return this.register.metrics();
  }
}
