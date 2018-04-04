import { success, notFound } from '../../services/response/'
import { sendMail } from '../../services/sendgrid'
import { PasswordReset } from '.'
import { User } from '../user'

export const create = ({ bodymen: { body: { email, link } } }, res, next) =>
  User.findOne({ email })
    .then(notFound(res))
    .then((user) => user ? PasswordReset.create({ user }) : null)
    .then((reset) => {
      if (!reset) return null
      const { user, token } = reset
      link = 'https://conectikidsback.herokuapp.com/api/forgot/'+token
      const content = `
        Estimado ${user.name}.<br><br>
        Has realizado una solicitud para cambiar la contraseña de tu cuenta en Conectikids.<br>
        Porfavor, sigue el siguiente enlace para configurar tu nueva contraseña, dicho enlace expirara en un periodo de 1 hora.<br><br>
        <a href="${link}">Cambiar mi contraseña</a><br><br>
        Si tu no has realizado ninguna solicitud, entonces ignora este correo<br><br>
        &mdash; Equipo Conectikids.
      `
      return sendMail({ toEmail: email, subject: 'conectikids - Password Reset', content })
    })
    .then((response) => response ? res.status(response.statusCode).end() : null)
    .catch(next)

export const show = ({ params: { token } }, res, next) =>
  PasswordReset.findOne({ token })
    .populate('user')
    .then(notFound(res))
    .then((reset) => reset ? reset.view(true) : null)
    .then(success(res))
    .catch(next)

export const update = ({ params: { token }, bodymen: { body: { password } } }, res, next) => {
  return PasswordReset.findOne({ token })
    .populate('user')
    .then(notFound(res))
    .then((reset) => {
      if (!reset) return null
      const { user } = reset
      return user.set({ password }).save()
        .then(() => PasswordReset.remove({ user }))
        .then(() => user.view(true))
    })
    .then(success(res))
    .catch(next)
}
