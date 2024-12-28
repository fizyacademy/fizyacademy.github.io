function useCoupon() {
    const couponCode = document.getElementById('coupon').value.trim();
    const username = user.username;

    if (!couponCode) {
        alert("Please enter a valid coupon code.");
        return;
    }

    const couponRef = database.ref('coupons/' + couponCode);
    const userRef = database.ref('users/' + username);

    // Check if the coupon exists
    couponRef.get().then(snapshot => {
        if (!snapshot.exists()) {
            alert("Invalid coupon code.");
            return;
        }

        // Check if the coupon has already been used by the user
        userRef.child('U-coupons/' + couponCode).get().then(snapshot => {
            if (snapshot.exists()) {
                alert("This coupon has already been used.");
                return;
            }

            // Mark the coupon as used by the user
            userRef.child('U-coupons').update({ [couponCode]: true })
                .then(() => {
                    // Optionally update coupon status or other operations
                    console.log('Coupon used:', couponCode);

                    // Optionally remove the coupon from the user's G-coupons
                    userRef.child('G-coupons/' + couponCode).remove()
                        .catch(error => console.error('Error removing coupon from G-coupons:', error));

                    // Optionally notify the user
                    addNotification('success', 'Coupon applied successfully!', '.popupContainer');
                    setTimeout(clearErrors, 3000);
                })
                .catch(error => {
                    console.error('Error updating U-coupons:', error);
                    alert("An error occurred while applying the coupon.");
                });
        }).catch(error => {
            console.error('Error checking U-coupons:', error);
            alert("An error occurred while checking the coupon status.");
        });
    }).catch(error => {
        console.error('Error checking coupon existence:', error);
        alert("An error occurred while validating the coupon.");
    });
}
