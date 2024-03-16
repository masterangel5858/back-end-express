function createNewMedicineData(userId, selectedMedicine, currentTime) {
    return {
      LineID: userId,
      MedicName: selectedMedicine.MedicName,
      Morning: selectedMedicine.Morning,
      Noon: selectedMedicine.Noon,
      Evening: selectedMedicine.Evening,
      afbf: selectedMedicine.afbf,
      MedicPicture: selectedMedicine.MedicPicture,
      status: selectedMedicine.Status,
      timestamp: currentTime
    };
  }