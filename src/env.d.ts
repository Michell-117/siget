/// <reference path="../.astro/types.d.ts" />

declare namespace App {
  interface Locals {
    user: {
      id: string; // O string, según el tipo de ID en tu base de datos
      usuario: string;
    } | null;
  }
}