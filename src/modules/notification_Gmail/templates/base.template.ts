export function baseTemplate(content: string) {
  return `
    <div style="font-family: Arial, sans-serif; background-color: #fafafa; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; padding: 20px;">
        ${content}
      </div>
      <footer style="text-align: center; color: #888; font-size: 12px; margin-top: 20px;">
        © ${new Date().getFullYear()} Sistema de Alquiler de Servicios
      </footer>
    </div>
  `;
}

