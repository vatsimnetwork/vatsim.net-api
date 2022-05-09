class NetworkStatus {
  private indicator: string;
  private description: string;

  public setIndicator(indicator: string) {
    this.indicator = indicator;
  }

  public setDescription(description: string) {
    this.description = description;
  }
}

export default NetworkStatus;
