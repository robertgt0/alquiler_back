// src/modules/notifications/dtos/createNotification.dto.ts

const { body } = require("express-validator");

export const createNotificationValidators = [
  body("message")
    .isString()
    .isLength({ min: 1, max: 500 })
    .withMessage("message is required and max 500 chars"),
  body("subject").isString().notEmpty().withMessage("subject is required"),
  body("destinations").isArray({ min: 1 }).withMessage("destinations must be an array with at least one item"),
  body("destinations.*.email").if(body("channel").equals("email")).isEmail().withMessage("destination email must be valid"),
  // optional fields
  body("type").optional().isString(),
  body("channel").optional().isIn(["email", "sms", "push"]),
];
