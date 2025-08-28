import { Injectable } from '@angular/core';
import { ToastService } from './toast.service';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private toastService: ToastService) {}

  success(message: string) {
    this.toastService.success('Sucesso!', message);
  }

  warn(message: string) {
    this.toastService.warning('Atenção!', message);
  }

  error(message: string) {
    this.toastService.error('Erro!', message);
  }

  info(message: string) {
    this.toastService.info('Informação', message);
  }

  // Métodos específicos para o sistema
  pacienteCadastradoComSucesso() {
    this.toastService.success(
      'Paciente cadastrado com sucesso!',
      'O paciente foi adicionado ao sistema e já está disponível para uso.'
    );
  }

  pacienteAtualizadoComSucesso() {
    this.toastService.success(
      'Paciente atualizado com sucesso!',
      'As informações do paciente foram atualizadas no sistema.'
    );
  }

  erroCadastroPaciente() {
    this.toastService.error(
      'Erro no cadastro do paciente',
      'Houve algum erro no cadastro do paciente. Verifique os dados e tente novamente.'
    );
  }

  erroAtualizacaoPaciente() {
    this.toastService.error(
      'Erro na atualização do paciente',
      'Houve algum erro ao atualizar o paciente. Verifique os dados e tente novamente.'
    );
  }

  exameCadastradoComSucesso() {
    this.toastService.success(
      'Exame cadastrado com sucesso!',
      'O exame foi adicionado ao sistema e já está disponível para consulta.'
    );
  }

  exameAtualizadoComSucesso() {
    this.toastService.success(
      'Exame atualizado com sucesso!',
      'As informações do exame foram atualizadas no sistema.'
    );
  }

  erroCadastroExame() {
    this.toastService.error(
      'Erro no cadastro do exame',
      'Houve algum erro no cadastro do exame. Verifique os dados e tente novamente.'
    );
  }

  erroAtualizacaoExame() {
    this.toastService.error(
      'Erro na atualização do exame',
      'Houve algum erro ao atualizar o exame. Verifique os dados e tente novamente.'
    );
  }

  erroCarregamentoPaciente() {
    this.toastService.error(
      'Erro ao carregar paciente',
      'Não foi possível carregar as informações do paciente. Tente novamente.'
    );
  }

  erroCarregamentoExame() {
    this.toastService.error(
      'Erro ao carregar exame',
      'Não foi possível carregar as informações do exame. Tente novamente.'
    );
  }

  erroRede() {
    this.toastService.error(
      'Erro de conexão',
      'Verifique sua conexão com a internet e tente novamente.'
    );
  }

  dadosInvalidos() {
    this.toastService.warning(
      'Dados inválidos',
      'Verifique os campos preenchidos e tente novamente.'
    );
  }

  recursoNaoEncontrado() {
    this.toastService.warning(
      'Recurso não encontrado',
      'O item que você está procurando não foi encontrado.'
    );
  }

  conflitoDuplicacao() {
    this.toastService.warning(
      'Dado duplicado',
      'Este item já existe no sistema. Verifique os dados informados.'
    );
  }

  erroInesperado() {
    this.toastService.error(
      'Erro inesperado',
      'Ocorreu um erro inesperado. Tente novamente ou entre em contato com o suporte.'
    );
  }
}
