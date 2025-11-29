import {
  SchedulerClient,
  CreateScheduleCommand,
  DeleteScheduleCommand,
} from "@aws-sdk/client-scheduler";

const schedulerClient = new SchedulerClient({
  region: process.env.AWS_REGION,
});

interface MovieData {
  title: string;
  tagline?: string;
  description?: string | null;
  releaseDate?: string;
  linkPreview?: string | null;
  imagePoster?: string | null;
}

export const createEmailSchedule = async (
  date: Date,
  payload: {
    to: string;
    subject?: string;
    message?: string;
    movie?: MovieData;
  }
) => {
  const scheduleName = `movie-${Date.now()}`;

  const isoDate = date.toISOString().replace(/\.\d{3}Z$/, "");

  const command = new CreateScheduleCommand({
    Name: scheduleName,
    Description: "Notificação de lançamento de filme",
    ScheduleExpression: `at(${isoDate})`,
    FlexibleTimeWindow: { Mode: "OFF" },
    Target: {
      Arn: process.env.LAMBDA_ARN!,
      RoleArn: process.env.SCHEDULER_ROLE_ARN!,
      Input: JSON.stringify(payload),
    },
  });

  await schedulerClient.send(command);
  console.log(`✅ Agendamento criado com sucesso: ${scheduleName}`);
  return scheduleName;
};

export const deleteEmailSchedule = async (scheduleName: string) => {
  try {
    const command = new DeleteScheduleCommand({
      Name: scheduleName,
    });
    await schedulerClient.send(command);
    console.log(`🗑️ Agendamento removido: ${scheduleName}`);
  } catch (err: any) {
    if (err.name === "ResourceNotFoundException") {
      console.log("Nenhum agendamento antigo encontrado.");
    } else {
      console.error("Erro ao deletar agendamento:", err);
    }
  }
};
