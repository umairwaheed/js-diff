__lcs_cache = {};
do_enable = false;

function enable_lcs()
{
    action = do_enable ? "with" : "without";
    $(".highlight").each(function(ind, ele) {
	    $(ele).html(__lcs_cache[ind+1][action]);
	});
    do_enable = do_enable ? false : true;
    if (do_enable) $('.lcs-handler').attr('title', 'Enable Highlighting');
    else $('.lcs-handler').attr('title', 'Disable Highlighting');
}

function do_lcs_replace(trans, corr, loop_id)
{
    try {
	et = get_encoded_text(trans, corr);
    }
    catch(err) {
	et = corr;
    }
    __lcs_cache[loop_id] = {};
    __lcs_cache[loop_id].without = corr;
    __lcs_cache[loop_id].with = et;
    return et
}

function get_encoded_text(t1, t2)
{
    lcs = calculate_lcs(t1, t2);
    result = [];
    print_diff(lcs, t1, t2, t1.length, t2.length, result);
    et = [];
    for (var i=0; i<result.length; i++) {
	if (result[i].sign == '+') {
	    val = "<span title='Addition' class='txt_addition'>";
	    val += result[i].value + "</span>";
	}
	else if (result[i].sign == '-') {
	    val = "<span title='Deletion' class='txt_deletion'>";
	    val += result[i].value + "</span>";
	}
	else val = result[i].value;
	et[et.length] = val;
    }
    return et.join('');
}

function calculate_lcs(X, Y)
{
    m = X.length;
    n = Y.length;
    C = [];
    for ( var i=0; i<m+1; i++) {
	C[i] = [];
	for ( var j=0; j<n+1; j++) C[i][j] = 0;
    }
    for ( var i=1; i<m+1; i++) {
	for ( var j=1; j<n+1; j++) {
	    if (X[i - 1] == Y[j - 1])
		C[i][j] = C[i - 1][j - 1] + 1;
	    else
		C[i][j] = Math.max(C[i][j - 1], C[i - 1][j]);
	}
    }
    return C;
}

function print_diff(C, X, Y, i, j, result)
{
    if (i > 0 && j > 0 && X[i - 1] == Y[j - 1]) {
	print_diff(C, X, Y, i - 1, j - 1, result);
	result[result.length] = {'sign': '', 'value': X[i - 1]};
    }
    else {
	if (j > 0 && (i == 0 || C[i][j - 1] >= C[i - 1][j])) {
	    print_diff(C, X, Y, i, j - 1, result);
	    result[result.length] = {'sign': '+', 'value': Y[j - 1]};
	}
	else if (i > 0 && (j == 0 || C[i][j - 1] < C[i - 1][j])) {
	    print_diff(C, X, Y, i - 1, j, result);
	    result[result.length] = {'sign': '-', 'value': X[i - 1]};
	}
    }
}
